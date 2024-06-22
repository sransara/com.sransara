import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { adocx } from 'astro-adocx/integration';

import { adocxConfig, asciidoctorConfig } from './adocx.config.js';
import siteValues from './site.values.js';

export default defineConfig({
  site: siteValues.site,
  integrations: [
    adocx(adocxConfig, asciidoctorConfig),
    sitemap(),
    solid({ devtools: true }),
    tailwind({
      config: {
        // Applied manually in BaseLayout.astro
        applyBaseStyles: false,
      },
    }),
  ],
});
