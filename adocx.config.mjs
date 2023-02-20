import asciidoctor from 'asciidoctor';
import { register as html5sBackendRegisterHandle } from 'asciidoctor-html5s';
import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';

const astroComponentScript = `
import { Image, Picture } from '@astrojs/image/components';
`;

export const adocxConfig = {
  astroComponentScript
};

const asciidoctorEngine = asciidoctor();
html5sBackendRegisterHandle(asciidoctorEngine.Extensions);
krokiPluginRegisterHandle(asciidoctorEngine.Extensions);

export const asciidoctorConfig = {
  safe: 'server',
  backend: 'html5s',
  template_dirs: ['./asciidoctor/templates'],
  template_cache: false,
  template_engine_options: {
    nunjucks: {
      tags: {
        variableStart: '{$',
        variableEnd: '$}'
      }
    }
  },
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
