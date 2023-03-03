import { defineConfig } from 'astro/config';
import image from '@astrojs/image';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';

import { adocx } from './asciidoctor/integration';
import { adocxConfig, asciidoctorConfig } from './adocx.config.mjs';

export default defineConfig({
  site: 'https://sransara.com',
  integrations: [
    adocx(adocxConfig, asciidoctorConfig),
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
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
