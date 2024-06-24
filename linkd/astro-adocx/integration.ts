import path from 'node:path';

import asciidoctor, { type Asciidoctor, type ProcessorOptions } from 'asciidoctor';
import type { AstroIntegration } from 'astro';
import { deepmerge } from 'deepmerge-ts';
import type { Plugin as VitePlugin } from 'vite';
import {
  compileAstro,
  type CompileAstroResult,
} from './node_modules/astro/dist/vite-plugin-astro/compile.js';

import subSpecialchars from './patches/sub_specialchars';

export type AstroAdocxOptions = {
  astroScriptHead?: string;
  astroScriptBody?: string;
  withAsciidocEngine?: (asciidoctorEngine: Asciidoctor) => void;
};

export type AdocOptions = ProcessorOptions;

const adocxExtension = '.adoc';

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

async function compileAdoc(
  asciidoctorEngine: Asciidoctor,
  fileId: string,
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: ProcessorOptions,
) {
  const document = asciidoctorEngine.loadFile(
    fileId,
    deepmerge(
      {
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
  const astroComponent = `---
${(adocxConfig.astroScriptHead ?? '').trim()}
${adocxScriptHead.trim()}
export const docattrs = ${JSON.stringify(docattrs)};
${(adocxConfig.astroScriptBody ?? '').trim()}
${adocxScriptBody.trim()}
---
${adocxContent.trim()}
`;
  return astroComponent;
}

export function adocx(
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: AdocOptions,
): AstroIntegration {
  let _compileAdoc: (filename: string) => Promise<string>;
  let _compileAstro: (code: string, filename: string) => Promise<CompileAstroResult>;
  return {
    name: '@sransara/astro-adocx',
    hooks: {
      async 'astro:config:setup'({ config: astroConfig, updateConfig, logger }) {
        const asciidoctorEngine = asciidoctor();
        subSpecialchars.register();
        if (adocxConfig.withAsciidocEngine) {
          adocxConfig.withAsciidocEngine(asciidoctorEngine);
        }
        _compileAdoc = async (filename) => {
          return compileAdoc(asciidoctorEngine, filename, adocxConfig, asciidoctorConfig);
        };

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-astro-adocx',
                enforce: 'pre',
                configResolved(viteConfig) {
                  _compileAstro = (code, filename) => {
                    return compileAstro({
                      compileProps: {
                        astroConfig,
                        viteConfig,
                        preferences: new Map() as any,
                        filename,
                        source: code,
                      },
                      astroFileToCompileMetadata: new Map(),
                      logger: logger as any,
                    });
                  };
                },
                async load(fileId) {
                  if (!fileId.endsWith(adocxExtension)) {
                    return;
                  }
                  const astroComponent = await _compileAdoc(fileId);
                  // fs.writeFileSync(fileId.replace(adocxExtension, '.mine.astro'), astroComponent);
                  return {
                    code: astroComponent,
                  };
                },
                async transform(source, fileId) {
                  if (!fileId.endsWith(adocxExtension)) {
                    return;
                  }
                  const astroComponent = source;
                  let transformResult: CompileAstroResult;
                  try {
                    transformResult = await _compileAstro(astroComponent, fileId);
                  } catch (err) {
                    // @ts-expect-error: Try to inject a file id to the error object
                    err.loc.file = `${fileId.replace(adocxExtension, '.astro')}`;
                    throw err;
                  }
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
