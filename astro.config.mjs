import { defineConfig } from 'astro/config';

// https://astro.build/config
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
import tailwind from '@astrojs/tailwind';

import { adocx } from './asciidoctor/integration';
import asciidoctorConfig from './asciidoctor.config.mjs';

export default defineConfig({
  integrations: [
    adocx(asciidoctorConfig),
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    }),
    solidJs(),
    tailwind()
  ]
});
