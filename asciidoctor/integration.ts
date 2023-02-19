import fs from 'node:fs/promises';
import path from 'node:path';

import type { AstroConfig, AstroIntegration } from 'astro';
import type { Plugin as VitePlugin } from 'vite';

import asciidoctor, { Asciidoctor } from 'asciidoctor';
import { deepmerge } from 'deepmerge-ts';
import fglob from 'fast-glob';

const asciidoctorEngine = asciidoctor();

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

const extensions = ['.adocx.astro', '.adoc.astro'];

export function asciidoctorx(asciidoctorConfig: Asciidoctor.ProcessorOptions): AstroIntegration {
  return {
    name: '@sransara/astro-asciidoctorx',
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
                  const converted = document.convert();
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
