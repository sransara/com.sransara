// Reference:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_image.html.erb

import { atag } from '@sransara/astro-adocx/utils/asx';
import type { Block, Inline } from 'asciidoctor';

import { convertImageNode } from '#/adocx/nodeConverters/inline_image';
import { type AdocNodeConverter } from '#/adocx/nodeConvertingConverter';

export const convert: AdocNodeConverter<Block> = (node: Block, opts?: any) => {
  const target = node.getAttribute('target');
  if (!target) {
    throw new Error('Missing target');
  }
  const inlineImage = convertImageNode(node as unknown as Inline, target, opts);
  if (inlineImage === null) {
    return null;
  }
  const id = node.getId();
  const title = node.getCaptionedTitle();
  const roles = node.getRoles();

  return atag('div', {
    id,
    class: ['imageblock', ...roles].join(' '),
    children: [
      atag('div', {
        class: 'content',
        children: [inlineImage],
      }),
      title &&
        atag('div', {
          class: 'title',
          children: [title],
        }),
    ],
  });
};

export default convert;
