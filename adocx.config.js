// @ts-ignore: Types are not available
import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';

const astroFenced = `
import Katex from '@/src/lib/astro/katex/Katex.astro';
import Shiki from '@/src/lib/astro/shiki/Shiki.astro';
`;

/** @type { import('astro-adocx/integration').AstroAdocxOptions } */
export const adocxConfig = {
  astroFenced,
  withAsciidocEngine(asciidoctorEngine) {
    krokiPluginRegisterHandle(asciidoctorEngine.Extensions);
  },
};

/** @type { import('astro-adocx/integration').AdocOptions } */
export const asciidoctorConfig = {
  safe: 'server',
  backend: 'html5',
  standalone: false,
  template_dirs: ['src/templates'],
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
};
