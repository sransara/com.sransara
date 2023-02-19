import asciidoctor from 'asciidoctor';
const asciidoctorEngine = asciidoctor();

import { register as html5sBackendRegisterHandle } from 'asciidoctor-html5s';
html5sBackendRegisterHandle(asciidoctorEngine.Extensions);

import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';
krokiPluginRegisterHandle(asciidoctorEngine.Extensions);

const config = {
  safe: 'server',
  backend: 'html5s',
  template_dirs: ['./asciidoctor/templates'],
  template_cache: false,
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

export default config;
