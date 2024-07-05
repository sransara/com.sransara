import siteValues from '@/site.values.js';
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { routes } from './_metas.ts';

export const GET: APIRoute = async function () {
  return rss({
    title: siteValues.name,
    description: siteValues.tagLine,
    site: siteValues.site,
    customData: '<language>en</language>',
    stylesheet: '/rss/style.xsl',
    items: routes('/')
      .sort((a, b) => b.metadata.publishedDate.localeCompare(a.metadata.publishedDate))
      .map(({ route, metadata }) => {
        const dateParts = metadata.publishedDate.split('-').map((part) => parseInt(part, 10));
        const pubDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
        return {
          title: metadata.title,
          pubDate,
          link: route,
        };
      }),
  });
};
