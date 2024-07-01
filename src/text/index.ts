import type { AstroInstance } from 'astro';

const adocs = import.meta.glob('./**/*.adoc');
export const entries = Object.fromEntries(
  Object.entries(adocs).map(([key, value]) => [
    key.replace(/^\.\//, ''),
    value as () => Promise<AstroInstance>,
  ]),
);
