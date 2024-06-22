const astroComponentScript = `
import { Image, Picture } from 'astro:assets';
import Katex from '@/src/lib/astro/katex/Katex.astro';
import Shiki from '@/src/lib/astro/shiki/Shiki.astro';
`;

export const adocxConfig = {
  astroComponentScript,
};

export const asciidoctorConfig = {
  safe: 'server',
  backend: 'html5',
  standalone: false,
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
  },
};
