import asciidoctor from 'asciidoctor';

import { register as converterRegisterHandle } from './asciidoctor/converter';
import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';

const astroComponentScript = `
import { Image, Picture } from '@astrojs/image/components';
import Katex from '@src/lib/astro/katex/Katex.astro';
import Shiki from '@src/lib/astro/shiki/Shiki.astro';
`;

export const adocxConfig = {
  astroComponentScript
};

const asciidoctorEngine = asciidoctor();
converterRegisterHandle(asciidoctorEngine);
krokiPluginRegisterHandle(asciidoctorEngine.Extensions);

export const asciidoctorConfig = {
  safe: 'server',
  backend: 'html5',
  standalone: false,
  attributes: {
    xrefstyle: 'short',
    'listing-caption': 'Listing',
    sectanchors: '',
    idprefix: 'id:',
    idseparator: '-',
    icons: 'font',
    stem: 'latexmath',
    toc: 'macro',
    imagesdir: './',
    'kroki-fetch-diagram': true
  }
};
