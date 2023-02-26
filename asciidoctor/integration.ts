import fs from 'node:fs/promises';
import path from 'node:path';

import type { AstroConfig, AstroIntegration } from 'astro';
import type { Plugin as VitePlugin } from 'vite';

import asciidoctor, { Asciidoctor } from 'asciidoctor';
import { deepmerge } from 'deepmerge-ts';
import fglob from 'fast-glob';

import { transform } from './transform';

interface AstroConfigSetupHookOptions {
  config: AstroConfig;
  command: 'dev' | 'build' | 'preview';
  isRestart: boolean;
  updateConfig: (newConfig: Record<string, any>) => void;
  // addRenderer: (renderer: AstroRenderer) => void;
  addWatchFile: (path: string | URL) => void;
  // injectScript: (stage: InjectedScriptStage, content: string) => void;
  // injectRoute: (injectRoute: InjectedRoute) => void;
}

interface AdocxOptions {
  astroComponentScript: string;
}

const asciidoctorEngine = asciidoctor();

const extensions = ['.adocx.astro', '.adoc.astro'];

function astroComponentParts(text: string) {
  let fence = /^---$(?<fenced>[\s\S]+?)^---$/m;
  const match = text.match(fence);
  if (match) {
    const componentScript = match.groups?.fenced || '';
    const textWithoutFence = text.replace(fence, '');
    return [componentScript, textWithoutFence];
  } else {
    return ['', text];
  }
}

export function adocx(
  adocxConfig: AdocxOptions,
  asciidoctorConfig: Asciidoctor.ProcessorOptions
): AstroIntegration {
  return {
    name: '@sransara/astro-adocx',
    hooks: {
      'astro:config:setup': async ({ addWatchFile, updateConfig }: AstroConfigSetupHookOptions) => {
        for (const templateDir of asciidoctorConfig.template_dirs || []) {
          const dependencies = fglob.sync(path.join(templateDir, '**'), { absolute: true });
          for (const dependency of dependencies) {
            addWatchFile(dependency);
          }
        }
        const cwd = path.dirname('');
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
                  if (!extensions.some((ext) => fileId.endsWith(ext))) {
                    return;
                  }
                  const fileContent = await fs.readFile(fileId, 'utf-8');
                  const document = asciidoctorEngine.load(
                    fileContent,
                    deepmerge(asciidoctorConfig, {
                      attributes: {
                        outdir: path.dirname(fileId)
                      }
                    })
                  );

                  const converted = document.convert();
                  let [componentScript, convertedHtml] = astroComponentParts(converted);
                  componentScript = `${adocxConfig.astroComponentScript.trim()}\n${componentScript.trim()}`;
                  convertedHtml = await transform(convertedHtml);

                  const astroComponent = `---\n${componentScript}\n---\n\n${convertedHtml}`;
                  // await fs.writeFile(`${path.dirname(fileId)}/out._astro`, astroComponent);
                  return {
                    code: astroComponent
                  };
                }
              }
            ] as VitePlugin[]
          }
        });
      }
    }
  };
}
