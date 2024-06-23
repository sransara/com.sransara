import { transform as astroTransform } from '@astrojs/compiler';
import asciidoctor, { type ProcessorOptions } from 'asciidoctor';
import type { AstroIntegration } from 'astro';
import { deepmerge } from 'deepmerge-ts';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin as VitePlugin } from 'vite';
import { registerConverter } from './converter';

export type AstroAdocxOptions = {
  astroScriptHead: string;
  astroScriptBody: string;
};

export type AdocOptions = ProcessorOptions;

const adocxExtension = '.adocx';

function astroComponentParts(html: string) {
  const fence = new RegExp(
    /<script-adocx-(?<type>head|body)>(?<code>[\s\S]+?)<\/script-adocx-(?:head|body)>/,
    'g',
  );
  const adocxScriptHead = [];
  const adocxScriptBody = [];
  const adocxContent = [];

  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = fence.exec(html)) !== null) {
    adocxContent.push(html.slice(lastIndex, match.index));
    lastIndex = fence.lastIndex;

    const [_full, type, code] = match;
    if (type === 'head') {
      adocxScriptHead.push(code);
    } else {
      adocxScriptBody.push(code);
    }
  }
  adocxContent.push(html.slice(lastIndex));
  return {
    adocxScriptHead: adocxScriptHead.join('\n'),
    adocxScriptBody: adocxScriptBody.join('\n'),
    adocxContent: adocxContent.join(''),
  };
}

async function compileAstroComponent(astroComponent: string, fileId: string) {
  const compile = await astroTransform(astroComponent, {
    filename: fileId,
    resolvePath: async (s) => path.join(path.dirname(fileId), s),
    internalURL: 'astro/runtime/server/index.js',
  });
  return compile;
}

async function compileAsciidoctor(
  fileId: string,
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: ProcessorOptions,
) {
  const asciidoctorEngine = asciidoctor();
  // Patch replacements inspired by: https://github.com/jirutka/asciidoctor-html5s/blob/master/lib/asciidoctor/html5s/replacements.rb
  // @ts-expect-error: REPLACEMENTS is a private API constant
  asciidoctorEngine.REPLACEMENTS.push([/\{/, '&lbrace;', 'none'], [/\}/, '&rbrace;', 'none']);
  registerConverter(asciidoctorEngine);

  const builtinTemplateDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'templates');
  const document = asciidoctorEngine.loadFile(
    fileId,
    deepmerge(
      {
        template_dirs: [builtinTemplateDir],
        attributes: {
          outdir: path.dirname(fileId),
        },
      },
      asciidoctorConfig,
    ),
  );
  const title = document.getTitle();
  const attributes: unknown = document.getAttributes();
  const docattrs: unknown = {
    title,
    ...(attributes as Record<string, unknown>),
  };

  const converted = document.convert();
  let { adocxScriptHead, adocxScriptBody, adocxContent } = astroComponentParts(converted);
  const astroComponent = `
---
${adocxConfig.astroScriptHead.trim()}
${adocxScriptHead.trim()}
export const docattrs = ${JSON.stringify(docattrs)};
${adocxConfig.astroScriptBody.trim()}
${adocxScriptBody.trim()}
---
${adocxContent.trim()}
`;
  return astroComponent;
}

export function adocx(
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: ProcessorOptions,
): AstroIntegration {
  return {
    name: '@sransara/astro-adocx',
    hooks: {
      async 'astro:config:setup'({ updateConfig }) {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-astro-adocx',
                enforce: 'pre',
                async load(fileId) {
                  if (!fileId.endsWith(adocxExtension)) {
                    return;
                  }
                  const astroComponent = await compileAsciidoctor(
                    fileId,
                    adocxConfig,
                    asciidoctorConfig,
                  );
                  await fs.writeFile(`${path.dirname(fileId)}/out._astro`, astroComponent);
                  const transformResult = await compileAstroComponent(astroComponent, fileId);
                  const astroMetadata = {
                    clientOnlyComponents: transformResult.clientOnlyComponents,
                    hydratedComponents: transformResult.hydratedComponents,
                    scripts: transformResult.scripts,
                    containsHead: transformResult.containsHead,
                    propagation: transformResult.propagation ? 'self' : 'none',
                    pageOptions: {},
                  };
                  return {
                    code: transformResult.code,
                    map: transformResult.map,
                    meta: {
                      astro: astroMetadata,
                      vite: {
                        // Setting this vite metadata to `ts` causes Vite to resolve .js
                        // extensions to .ts files.
                        lang: 'ts',
                      },
                    },
                  };
                },
              },
            ] as VitePlugin[],
          },
        });
      },
    },
  };
}
