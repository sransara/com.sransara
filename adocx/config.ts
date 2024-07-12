import path from 'node:path';

import type { AdocOptions, AstroAdocxOptions } from '@sransara/astro-adocx/types';
// @ts-ignore: Types are not available
import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';

import { register as inlineMacroCalloutRegisterHandle } from './extensions/inlineMacroCallout';
import {
  type AdocNodeConverters,
  register as nodeConvertingConverterRegisterHandle,
} from './nodeConvertingConverter';

const nodeConverters = Object.fromEntries(
  Object.entries(import.meta.glob('./nodeConverters/*.ts', { eager: true, import: 'convert' })).map(
    ([key, value]) => [path.basename(key, '.ts'), value],
  ),
) as AdocNodeConverters;

const astroFenced = `
// For astro-layout-args
import { metadata } from './_meta/metadata.ts';
import poster from './_meta/poster.jpg';
`;

export const adocxConfig = {
  astroFenced,
  withAsciidocEngine(asciidoctorEngine) {
    nodeConvertingConverterRegisterHandle(asciidoctorEngine, nodeConverters);
    krokiPluginRegisterHandle(asciidoctorEngine.Extensions);
    inlineMacroCalloutRegisterHandle(asciidoctorEngine.Extensions);
  },
  withDocument(filePath, document) {
    // useful for asciidoctor-diagrams/kroki
    document.setAttribute('outdir', path.dirname(filePath));
  },
  astroLayouts: {
    note: {
      path: '@/src/layouts/adocNoteLayout/AdocNoteLayout.astro',
      args: 'poster={poster} metadata={metadata}',
    },
  },
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
  },
} satisfies AdocOptions;
