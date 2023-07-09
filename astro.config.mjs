import { defineConfig } from 'astro/config';
import image from '@astrojs/image';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';

import siteValues from './site.values.mjs';
import { adocx } from './integrations/asciidoctor/integration';
import { adocxConfig, asciidoctorConfig } from './adocx.config.mjs';

export default defineConfig({
  site: siteValues.site,
  scopedStyleStrategy: 'class',
  integrations: [
    adocx(adocxConfig, asciidoctorConfig),
    image({
      serviceEntryPoint: './integrations/image/svg-sharp.js'
    }),
    solidJs(),
    tailwind({
      config: {
        // Applied manually in BaseLayout.astro
        applyBaseStyles: false
      }
    })
  ]
});
