// Reference:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_math.html.erb

import { addOnceToAstroFence } from '@sransara/astro-adocx/utils/astroFence';
import { atag } from '@sransara/astro-adocx/utils/asx';
import type { Block } from 'asciidoctor';

import { type AdocNodeConverter } from '#adocx/nodeConvertingConverter';

export const convert: AdocNodeConverter<Block> = (node: Block, _opts?: any) => {
  const id = node.getId();
  const title = node.getCaptionedTitle();
  const roles = node.getRoles().join(' ');
  const content = node.getContent();
  const style = node.getStyle();
  addOnceToAstroFence(node, "import Mathtex from '@/src/astro/mathtex/Mathtex.astro';");
  return atag('div', {
    id,
    class: `mathblock ${roles}`,
    children: [
      title &&
        atag('div', {
          class: 'title',
          children: [title],
        }),
      atag('div', {
        class: 'content',
        children: [
          atag('Mathtex', {
            block: true,
            lang: style,
            children: [content],
          }),
        ],
      }),
    ],
  });
};
