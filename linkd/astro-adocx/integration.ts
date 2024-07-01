import fs from 'node:fs';

import type { Asciidoctor, ProcessorOptions } from 'asciidoctor';
import asciidoctor from 'asciidoctor';
import type { AstroIntegration } from 'astro';
import type { Plugin as VitePlugin } from 'vite';

import path from 'node:path';
import { register as converterRegisterHandle } from './converter.ts';
import subSpecialchars from './patches/sub_specialchars';
import type { AdocOptions, AstroAdocxOptions } from './types.js';
import { decodeSpecialChars } from './utils/astroFence.ts';

const adocxExtension = '.adoc';

async function compileAdoc(
  asciidoctorEngine: Asciidoctor,
  fileId: string,
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: ProcessorOptions,
) {
  const document = asciidoctorEngine.loadFile(fileId, asciidoctorConfig);
  adocxConfig.withDocument?.(fileId, document);

  const converted = document.convert();
  const docattrs = document.getAttributes() as Record<string, string | undefined>;

  // Astro component's fenced code declared in the config
  const adocxConfigAstroFenced = adocxConfig.astroFenced ?? '';
  // Astro component's fenced code added by the templates
  const astroFenced = decodeSpecialChars(document.getAttribute('astro-fenced') ?? '');
  // Astro component's fenced code declared in the document itself
  const frontMatter = decodeSpecialChars(document.getAttribute('front-matter') ?? '');

  const astroComponent = `---
${adocxConfigAstroFenced.trim()}
export let docattrs = ${JSON.stringify(docattrs)};
${astroFenced.trim()}
${frontMatter.trim()}
---
${converted.trim()}
`;
  return astroComponent;
}

export function adocx(
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: AdocOptions,
): AstroIntegration {
  let _compileAdoc: (filename: string) => Promise<string>;
  return {
    name: '@sransara/astro-adocx',
    hooks: {
      async 'astro:config:setup'({ config: astroConfig, updateConfig, addWatchFile }) {
        const asciidoctorEngine = asciidoctor();
        subSpecialchars.patch();
        converterRegisterHandle(asciidoctorEngine, adocxConfig.templates ?? {});
        adocxConfig.withAsciidocEngine?.(asciidoctorEngine);

        // Default asciidoctor config that makes sense in this context
        asciidoctorConfig.standalone = false;
        asciidoctorConfig.safe = 'server';
        asciidoctorConfig.backend = 'html5';
        if (asciidoctorConfig.attributes === undefined) {
          asciidoctorConfig.attributes = {};
        }
        // allow astro code fences at the beginning
        asciidoctorConfig.attributes['skip-front-matter'] = true;

        _compileAdoc = async (filename) => {
          return compileAdoc(asciidoctorEngine, filename, adocxConfig, asciidoctorConfig);
        };

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-astro-adocx',
                enforce: 'pre',
                resolveId(source, importer, options) {
                  if (source.endsWith(adocxExtension) && importer !== undefined) {
                    return path.join(path.dirname(importer), source + '.astro');
                  }
                },
                async load(fileId) {
                  if (!fileId.endsWith(adocxExtension + '.astro')) {
                    return;
                  }
                  fileId = fileId.replace(adocxExtension + '.astro', adocxExtension);
                  fileId = path.resolve(astroConfig.root.pathname, path.join('.', fileId));
                  addWatchFile(fileId);
                  try {
                    const astroComponent = await _compileAdoc(fileId);
                    fs.writeFileSync(
                      fileId.replace(adocxExtension, '.debug.astro'),
                      astroComponent,
                    );
                    return {
                      code: astroComponent,
                    };
                  } catch (e) {
                    // console.error(e);
                    throw new Error(`Error processing adoc file: ${fileId}: ${e}`);
                  }
                },
              },
            ] as VitePlugin[],
          },
        });
      },
    },
  };
}
