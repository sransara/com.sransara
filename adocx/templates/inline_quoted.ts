import type { Inline } from 'asciidoctor';
import { UnsupportedNode, type Template } from 'astro-adocx/types.ts';
import { addOnceToAstroFence } from 'astro-adocx/utils/astroFence.ts';

export const convert: Template<Inline>['convert'] = (node: Inline, opts?: any) => {
  const nodeType = node.getType();
  if (['asciimath', 'latexmath'].includes(nodeType)) {
    addOnceToAstroFence(node, "import Katex from '@/src/lib/astro/katex/Katex.astro';");
    return `<Katex block={false} lang="${nodeType}" is:raw={true}>${node.getText()}</Katex>`;
  }
  return UnsupportedNode;
};
