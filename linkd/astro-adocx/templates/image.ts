// Reference:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_image.html.erb

import type { Block, Inline } from 'asciidoctor';
import { UnsupportedNode, type Template } from '../types.ts';
import { atag } from '../utils/asx.ts';
import { convertImageNode } from './inline_image.ts';

export const convert: Template<Block>['convert'] = (node: Block, opts?: any) => {
  const target = node.getAttribute('target');
  if (!target) {
    throw new Error('Missing target');
  }
  const inlineImage = convertImageNode(node as unknown as Inline, target, opts);
  if (inlineImage === UnsupportedNode) {
    return UnsupportedNode;
  }
  const id = node.getId();
  const title = node.getCaptionedTitle();
  const roles = node.getRoles().join(' ');

  return atag('div', {
    id,
    class: 'imageblock',
    'data-roles': roles,
    children: [
      atag('div', {
        class: 'content',
        children: [inlineImage],
      }),
      atag('div', {
        class: 'title',
        children: [title],
      }),
    ],
  });
};
