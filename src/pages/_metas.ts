import type { Metadata } from '#/src/lib/types/notes';

type Metas = Record<string, { metadata: Metadata }>;
const metas = import.meta.glob('./**/_meta/metadata.ts', { eager: true }) as Metas;

/** Routes with metadata */
export const routes = (routePrefix: string) => {
  return Object.entries(metas)
    .filter(([path]) => path.startsWith(`.${routePrefix}`))
    .map(([path, { metadata }]) => {
      const route = path.slice(1, -'_meta/metadata.ts'.length);
      return {
        route,
        metadata,
      };
    });
};
