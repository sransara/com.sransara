const astroComponentScript = `
import { Image, Picture } from '@astrojs/image/components';
import Katex from '@src/lib/astro/katex/Katex.astro';
import Shiki from '@src/lib/astro/shiki/Shiki.astro';
`;

export const adocxConfig = {
  astroComponentScript
};

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
    'kroki-fetch-diagram': true,
    'kroki-default-format': 'png'
  }
};
