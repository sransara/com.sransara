import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';

/** @type { import("eslint").Linter.Config[] } */
const config = [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];

export default config;
