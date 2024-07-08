import type { Inline } from 'asciidoctor';
import { UnsupportedNode, type Template } from '@sransara/astro-adocx/types.js';
import { addOnceToAstroFence } from '@sransara/astro-adocx/utils/astroFence.js';

export const convert: Template<Inline>['convert'] = (node: Inline, _opts?: any) => {
  const nodeType = node.getType();
  if (['asciimath', 'latexmath'].includes(nodeType)) {
    addOnceToAstroFence(node, "import Mathtex from '@/src/lib/astro/mathtex/Mathtex.astro';");
    return `<Mathtex block={false} lang="${nodeType}" is:raw={true}>${node.getText()}</Mathtex>`;
  }
  return UnsupportedNode;
};
