import fs from 'node:fs/promises';
import path from 'node:path';

import type { AstroConfig, AstroIntegration } from 'astro';
import type { Plugin as VitePlugin } from 'vite';

import asciidoctor, { Asciidoctor } from 'asciidoctor';
import { deepmerge } from 'deepmerge-ts';
import fglob from 'fast-glob';

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

function prependAstroComponentScript(text: string, componentScript: string) {
  let fence = /^[\r\n]+---/;
  if (text.match(fence)) {
    const textWithoutFenceStart = text.replace(fence, '');
    return `---
${componentScript}
${textWithoutFenceStart}`;
  } else {
    return `---
${componentScript}
---
${text}`;
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
                  let converted = document.convert();
                  converted = prependAstroComponentScript(
                    converted,
                    adocxConfig.astroComponentScript
                  );
                  return {
                    code: converted
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
