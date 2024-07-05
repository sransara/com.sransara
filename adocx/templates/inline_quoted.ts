import type { Inline } from 'asciidoctor';
import { UnsupportedNode, type Template } from 'astro-adocx/types.ts';
import { addOnceToAstroFence } from 'astro-adocx/utils/astroFence.ts';

export const convert: Template<Inline>['convert'] = (node: Inline, opts?: any) => {
  const nodeType = node.getType();
  if (['asciimath', 'latexmath'].includes(nodeType)) {
    addOnceToAstroFence(node, "import Mathtex from '@/src/lib/astro/mathtex/Mathtex.astro';");
    return `<Mathtex block={false} lang="${nodeType}" is:raw={true}>${node.getText()}</Mathtex>`;
  }
  return UnsupportedNode;
};
