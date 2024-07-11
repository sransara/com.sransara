// Reference:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_math.html.erb

import { type AdocNodeConverter } from '@sransara/astro-adocx/types';
import { addOnceToAstroFence } from '@sransara/astro-adocx/utils/astroFence';
import { atag } from '@sransara/astro-adocx/utils/asx';
import type { Block } from 'asciidoctor';

export const convert: AdocNodeConverter<Block> = (node: Block, _opts?: any) => {
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
