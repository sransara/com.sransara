import path from 'node:path';

import asciidoctor, { type ProcessorOptions } from 'asciidoctor';
import type { AstroIntegration } from 'astro';
import { deepmerge } from 'deepmerge-ts';
import type { Plugin as VitePlugin } from 'vite';
import {
  compileAstro,
  type CompileAstroResult,
} from './node_modules/astro/dist/vite-plugin-astro/compile.js';

import subSpecialchars from './patches/sub_specialchars';

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

async function compileAsciidoctor(
  fileId: string,
  adocxConfig: AstroAdocxOptions,
  asciidoctorConfig: ProcessorOptions,
) {
  const asciidoctorEngine = asciidoctor();
  subSpecialchars.register();

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
  let compile: (code: string, filename: string) => Promise<CompileAstroResult>;

  return {
    name: '@sransara/astro-adocx',
    hooks: {
      async 'astro:config:setup'({ config: astroConfig, updateConfig, logger }) {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-astro-adocx',
                enforce: 'pre',
                configResolved(viteConfig) {
                  compile = (code, filename) => {
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
                  const astroComponent = await compileAsciidoctor(
                    fileId,
                    adocxConfig,
                    asciidoctorConfig,
                  );
                  // await fs.writeFile(`${path.dirname(fileId)}/out.mine.astro`, astroComponent);

                  let transformResult;
                  try {
                    transformResult = await compile(astroComponent, fileId);
                  } catch (e) {
                    // @ts-expect-error: Add correct file to error object
                    e.loc.file = `${fileId.replace(adocxExtension, '.astro')}`;
                    console.error(e);
                    throw e;
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
