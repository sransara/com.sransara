// Reference:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_math.html.erb

import { addOnceToAstroFence } from '@sransara/astro-adocx/utils/astroFence';
import { atag } from '@sransara/astro-adocx/utils/asx';
import type { Block } from 'asciidoctor';

import { type AdocNodeConverter } from '#adocx/nodeConvertingConverter';

export const convert: AdocNodeConverter<Block> = (node: Block, _opts?: any) => {
  const id = node.getId();
  const title = node.getCaptionedTitle();
  const roles = node.getRoles();
  const content = node.getContent();
  const lang = node.getAttribute('language');

  addOnceToAstroFence(node, "import CodeListing from '@/src/astro/codeListing/CodeListing.astro';");
  return atag('div', {
    id,
    class: ['listingblock', ...roles].join(' '),
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
            'is:raw': true,
            children: [content],
          }),
        ],
      }),
    ],
  });
};
