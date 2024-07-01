import type { AstroInstance } from 'astro';

export const entries = Object.fromEntries(
  Object.entries(import.meta.glob('./**/*.adoc')).map(([key, value]) => [
    key.replace(/^\.\//, ''),
    value as () => Promise<AstroInstance>,
  ]),
);
