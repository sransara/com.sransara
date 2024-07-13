import { addOnceToAstroFence } from '@sransara/astro-adocx/utils/astroFence';
import type { Inline } from 'asciidoctor';
import { type AdocNodeConverter } from '../nodeConvertingConverter';

export const convert: AdocNodeConverter<Inline> = (node: Inline, _opts?: any) => {
  const nodeType = node.getType();
  if (['asciimath', 'latexmath'].includes(nodeType)) {
    addOnceToAstroFence(node, "import Mathtex from '@/src/lib/astro/mathtex/Mathtex.astro';");
    return `<Mathtex block={false} lang="${nodeType}" is:raw={true}>${node.getText()}</Mathtex>`;
  }
  return null;
};
