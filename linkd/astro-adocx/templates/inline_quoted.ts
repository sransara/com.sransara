import type { Inline } from 'asciidoctor';

export function supports(node: Inline, opts?: any) {
  const nodeType = node.getType();
  if (['asciimath', 'latexmath'].includes(nodeType)) {
    return true;
  }
  return false;
}

export function convert(node: Inline, opts?: any) {
  const nodeType = node.getType();
  if (['asciimath', 'latexmath'].includes(nodeType)) {
    return `<Katex block={false} lang="${nodeType}" is:raw={true}>${node.getText()}</Katex>`;
  }
  throw new Error(`Unsupported node type: ${nodeType}`);
}
