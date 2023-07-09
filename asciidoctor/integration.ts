import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AstroConfig, AstroIntegration } from 'astro';
import type { Plugin as VitePlugin } from 'vite';

import asciidoctor, { type ProcessorOptions } from 'asciidoctor';
import { deepmerge } from 'deepmerge-ts';
import fglob from 'fast-glob';

import { transform } from './transform';

type AstroConfigSetupHookOptions = {
  config: AstroConfig;
  command: 'dev' | 'build' | 'preview';
  isRestart: boolean;
  updateConfig: (newConfig: Record<string, any>) => void;
  // AddRenderer: (renderer: AstroRenderer) => void;
  addWatchFile: (path: string | URL) => void;
  // InjectScript: (stage: InjectedScriptStage, content: string) => void;
  // injectRoute: (injectRoute: InjectedRoute) => void;
};

type AdocxOptions = {
  astroComponentScript: string;
};

const asciidoctorEngine = asciidoctor();

const extensions = ['.adocx.astro', '.adoc.astro'];

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

async function compile(
  fileId: string,
  fileReader: string | Promise<string>,
  adocxConfig: AdocxOptions,
  asciidoctorConfig: ProcessorOptions
) {
  const fileContent = await fileReader;
  const document = asciidoctorEngine.load(
    fileContent,
    deepmerge(asciidoctorConfig, {
      attributes: {
        outdir: path.dirname(fileId)
      }
    })
  );

  const title = document.getTitle();
  const attributes: unknown = document.getAttributes();
  const docattrs: unknown = {
    title,
    ...(attributes as Record<string, unknown>)
  };

  const converted = document.convert();
  let [componentScript, convertedHtml] = astroComponentParts(converted);
  componentScript = `${adocxConfig.astroComponentScript.trim()}\n${componentScript.trim()}`;
  convertedHtml = await transform(convertedHtml);

  const astroComponent = `
---
${componentScript}
export const docattrs = ${JSON.stringify(docattrs)};
---
${convertedHtml}
`;

  return astroComponent;
}

export function adocx(
  adocxConfig: AdocxOptions,
  asciidoctorConfig: ProcessorOptions
): AstroIntegration {
  return {
    name: '@sransara/astro-adocx',
    hooks: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      async 'astro:config:setup'({
        config: astroConfig,
        addWatchFile,
        updateConfig
      }: AstroConfigSetupHookOptions) {
        for (const templateDir of asciidoctorConfig.template_dirs ?? []) {
          const dependencies = fglob.sync(path.join(templateDir, '**'), { absolute: true });
          for (const dependency of dependencies) {
            addWatchFile(dependency);
          }
        }

        const cwd = fileURLToPath(astroConfig.root);
        const adocxFiles = path.join(cwd, 'asciidoctor', '**/*.ts');
        const adocxConfigFile = path.join(cwd, 'adocx.config.mjs');
        const dependencies = fglob.sync([adocxFiles, adocxConfigFile], { absolute: true });
        for (const dependency of dependencies) {
          addWatchFile(dependency);
        }

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'astro-adoc',
                enforce: 'pre',
                async load(fileId) {
                  fileId = fileId.split('?')[0];
                  if (!extensions.some((ext) => fileId.endsWith(ext))) {
                    return;
                  }

                  const fileContent = await fs.readFile(fileId, 'utf-8');
                  const astroComponent = await compile(
                    fileId,
                    fileContent,
                    adocxConfig,
                    asciidoctorConfig
                  );
                  // Await fs.writeFile(`${path.dirname(fileId)}/out._astro`, astroComponent);
                  return {
                    code: astroComponent
                  };
                },
                async handleHotUpdate(context) {
                  // Hack to make HMR work
                  const fileContent = await context.read();
                  context.read = async () =>
                    compile(context.file, fileContent, adocxConfig, asciidoctorConfig);
                  return context.modules;
                },
                async configureServer(server) {
                  // Hack to make HMR work
                  // Move our plugin to before astro:build plugin
                  const plugins = server.config.plugins as VitePlugin[];
                  const findPluginIndex = (ps: VitePlugin[], name: string) =>
                    ps.findIndex((p) => p.name === name);
                  const adocxPluginIndex = findPluginIndex(plugins, 'astro-adoc');
                  const adocxPlugin = plugins[adocxPluginIndex];
                  const astroBuildPluginIndex = findPluginIndex(plugins, 'astro:build');
                  plugins.splice(adocxPluginIndex, 1);
                  plugins.splice(astroBuildPluginIndex, 0, adocxPlugin);
                }
              }
            ] as VitePlugin[]
          }
        });
      }
    }
  };
}
