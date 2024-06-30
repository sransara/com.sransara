import path from 'node:path';

// @ts-ignore: Types are not available
import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';
import type { AdocOptions, AstroAdocxOptions, Template } from 'astro-adocx/types';

import { register as inlineMacroCalloutRegisterHandle } from './extensions/inlineMacroCallout';

const templates = Object.fromEntries(
  Object.entries(import.meta.glob('./templates/*.ts', { eager: true })).map(([key, value]) => [
    path.basename(key, '.ts'),
    value as Template,
  ]),
);

const astroFenced = ``;

export const adocxConfig = {
  astroFenced,
  withAsciidocEngine(asciidoctorEngine) {
    krokiPluginRegisterHandle(asciidoctorEngine.Extensions);
    inlineMacroCalloutRegisterHandle(asciidoctorEngine.Extensions);
  },
  withDocument(filePath, document) {
    // useful for asciidoctor-diagrams/kroki
    document.setAttribute('outdir', path.dirname(filePath));
  },
  templates,
} satisfies AstroAdocxOptions;

export const asciidoctorConfig = {
  attributes: {
    xrefstyle: 'full',
    'listing-caption': 'Listing',
    sectanchors: '',
    idprefix: 'id:',
    idseparator: '-',
    icons: 'font',
    stem: 'latexmath',
    toc: 'macro',
    imagesdir: './',
    'kroki-fetch-diagram': true,
    'kroki-default-format': 'png',
  },
} satisfies AdocOptions;
