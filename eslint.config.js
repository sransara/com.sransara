import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';

/** @type { import("eslint").Linter.FlatConfig[] } */
const config = [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
  {
    ignores: ['public/count.js'],
  },
];

export default config;
