import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import { adocx } from '@sransara/astro-adocx/integration';
import { defineConfig } from 'astro/config';

import { adocxConfig, asciidoctorConfig } from './adocx/config';
import siteValues from './site.values';

export default defineConfig({
  site: siteValues.site,
  integrations: [
    adocx(adocxConfig, asciidoctorConfig),
    sitemap(),
    solid({ devtools: true }),
    tailwind(),
  ],
});
