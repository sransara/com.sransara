import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import siteValues from '~/site.values.mjs';

export const get: APIRoute = async function () {
  return rss({
    title: siteValues.name,
    description: siteValues.tagLine,
    site: siteValues.site,
    customData: '<language>en</language>',
    items: []
  });
};
