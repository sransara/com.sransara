// Reference:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_math.html.erb

import type { Block } from 'asciidoctor';
import { type Template } from 'astro-adocx/types.ts';
import { addOnceToAstroFence } from 'astro-adocx/utils/astroFence';
import { atag } from 'astro-adocx/utils/asx.ts';

export const convert: Template<Block>['convert'] = (node: Block, _opts?: any) => {
  const id = node.getId();
  const title = node.getCaptionedTitle();
  const roles = node.getRoles().join(' ');
  const content = node.getContent();
  const style = node.getStyle();
  addOnceToAstroFence(node, "import Mathtex from '@/src/lib/astro/mathtex/Mathtex.astro';");
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
