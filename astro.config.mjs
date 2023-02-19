import { defineConfig } from 'astro/config';

// https://astro.build/config
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
import tailwind from '@astrojs/tailwind';

import { asciidoctorx } from './asciidoctor/integration';
import asciidoctorConfig from './asciidoctor.config.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [asciidoctorx(asciidoctorConfig), solidJs(), tailwind()]
});
