import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import { adocx } from 'astro-adocx/integration';
import { defineConfig } from 'astro/config';

import { adocxConfig, asciidoctorConfig } from './adocx/config.ts';
import siteValues from './site.values.js';

export default defineConfig({
  site: siteValues.site,
  integrations: [
    adocx(adocxConfig, asciidoctorConfig),
    sitemap(),
    solid({ devtools: true }),
    tailwind(),
  ],
});
