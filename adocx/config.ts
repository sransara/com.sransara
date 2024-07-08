import path from 'node:path';

// @ts-ignore: Types are not available
import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';
import type { AdocOptions, AstroAdocxOptions, Template } from '@sransara/astro-adocx/types';

import { register as inlineMacroCalloutRegisterHandle } from './extensions/inlineMacroCallout';

const templates = Object.fromEntries(
  Object.entries(import.meta.glob('./templates/*.ts', { eager: true })).map(([key, value]) => [
    path.basename(key, '.ts'),
    value as Template,
  ]),
);

const astroFenced = `
// For astro-layout-args
import { metadata } from './_meta/metadata.ts';
import poster from './_meta/poster.jpg';
`;

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
    imagesdir: './_assets/',
    'kroki-fetch-diagram': true,
    'kroki-default-format': 'png',
    'astro-layout-path': '@/src/layouts/adocNoteLayout/AdocNoteLayout.astro',
    'astro-layout-args': '{...{ metadata, poster, docattrs, outline }}',
  },
} satisfies AdocOptions;
