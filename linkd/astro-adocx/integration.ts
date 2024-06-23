import { transform as astroTransform } from '@astrojs/compiler';
import asciidoctor, { type ProcessorOptions } from 'asciidoctor';
import type { AstroIntegration } from 'astro';
import { deepmerge } from 'deepmerge-ts';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin as VitePlugin } from 'vite';
import { registerConverter } from './converter';

type AdocxOptions = {
  astroComponentScript: string;
};

const adocxExtension = '.adocx';

function astroComponentParts(text: string) {
  const fence = /^---$(?<fenced>[\s\S]+?)^---$/m;
  const match = fence.exec(text);
  if (match) {
    const componentScript = match.groups?.fenced ?? '';
    const textWithoutFence = text.replace(fence, '');
    return [componentScript, textWithoutFence];
  }

  return ['', text];
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
  adocxConfig: AdocxOptions,
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
  let [componentScript, convertedHtml] = astroComponentParts(converted);
  componentScript = `${adocxConfig.astroComponentScript.trim()}\n${componentScript.trim()}`;
  const astroComponent = `
---
import { components as builtinComponents } from 'astro-adocx/components';
${componentScript}
const { components = {} } = Astro.props;
const Components = { ...builtinComponents, ...components };
export const docattrs = ${JSON.stringify(docattrs)};
---
${convertedHtml}
`;
  return astroComponent;
}

export function adocx(
  adocxConfig: AdocxOptions,
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
