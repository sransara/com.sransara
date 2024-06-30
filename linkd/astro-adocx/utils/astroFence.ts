import type { AbstractNode } from 'asciidoctor';

export function decodeSpecialChars(str: string) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&lbrace;/g, '{')
    .replace(/&rbrace;/g, '}');
}

export function addOnceToAstroFence(node: AbstractNode, fencedLines: string) {
  const document = node.getDocument();
  fencedLines = fencedLines.trim();
  const astroFenced: string = decodeSpecialChars(document.getAttribute('astro-fenced') ?? '');
  if (astroFenced.includes(fencedLines)) {
    return;
  }
  document.setAttribute('astro-fenced', astroFenced + `${fencedLines}\n`);
}
