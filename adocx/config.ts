import type { AdocOptions, AstroAdocxOptions } from '@sransara/astro-adocx/config';
import fg from 'fast-glob';
import path from 'node:path';
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
  async withAsciidocEngine(asciidoctorEngine) {
    nodeConvertingConverterRegisterHandle(asciidoctorEngine, nodeConverters);
    krokiPluginRegisterHandle(asciidoctorEngine.Extensions);
    inlineMacroCalloutRegisterHandle(asciidoctorEngine.Extensions);
  },
  async withDocument(filePath, document) {
    // useful for asciidoctor-diagrams/kroki
    document.setAttribute('outdir', path.dirname(filePath));
    // extract the relative path from the src/
    document.setAttribute('source-file', filePath.replace(/.*\/src\//, 'src/'));
  },
  async withConvertedDocument(_filePath, astroTemplate) {
    return astroTemplate;
  },
  async withAstroComponent(_filePath, component) {
    return component;
  },
  astroLayouts: {
    note: {
      path: '@/src/layouts/adocNoteLayout/AdocNoteLayout.astro',
      args: 'poster={poster} metadata={metadata}',
    },
  },
  watchFiles: fg.sync('./adocx/**/*.*'),
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
