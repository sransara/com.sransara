import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import siteValues from '@/site.values.mjs';
import { getNoteMetadata } from '@src/lib/utils';

export const get: APIRoute = async function () {
  const notes = await getNoteMetadata();

  return rss({
    title: siteValues.name,
    description: siteValues.tagLine,
    site: siteValues.site,
    customData: '<language>en</language>',
    stylesheet: '/rss/style.xsl',
    items: Object.keys(notes)
      .sort((a, b) => b.localeCompare(a))
      .flatMap((year) =>
        notes[year]
          .sort((a, b) => b.metadata.publishedDate.localeCompare(a.metadata.publishedDate))
          .map(({ route, metadata }) => {
            const dateParts = metadata.publishedDate.split('-').map((part) => parseInt(part, 10));
            const pubDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
            return {
              title: metadata.title,
              pubDate,
              link: route
            };
          })
      )
  });
};
