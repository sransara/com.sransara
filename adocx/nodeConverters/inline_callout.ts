import type { Inline } from 'asciidoctor';

import { type AdocNodeConverter } from '#adocx/nodeConvertingConverter';

export const convert: AdocNodeConverter<Inline> = (node: Inline, _opts?: any) => {
  const text = node.getText();
  return `\u0D82${text}\u0D83`;
};
