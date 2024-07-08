// Reference:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_math.html.erb

import type { Block } from 'asciidoctor';
import { type Template } from '@sransara/astro-adocx/types.js';
import { addOnceToAstroFence } from '@sransara/astro-adocx/utils/astroFence.js';
import { atag } from '@sransara/astro-adocx/utils/asx.js';

export const convert: Template<Block>['convert'] = (node: Block, _opts?: any) => {
  const id = node.getId();
  const title = node.getCaptionedTitle();
  const roles = node.getRoles().join(' ');
  const content = node.getContent();
  const lang = node.getAttribute('language');

  addOnceToAstroFence(
    node,
    "import CodeListing from '@/src/lib/astro/codeListing/CodeListing.astro';",
  );
  return atag('div', {
    id,
    class: `listingblock ${roles}`,
    children: [
      title &&
        atag('div', {
          class: 'title',
          children: [title],
        }),
      atag('div', {
        class: 'content',
        children: [
          atag('CodeListing', {
            lang,
            children: [content],
          }),
        ],
      }),
    ],
  });
};
