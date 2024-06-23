import type { AbstractNode, Asciidoctor, Html5Converter } from 'asciidoctor';
import path from 'node:path';

const imports = import.meta.glob('./templates/*.js', { eager: true, import: 'default' });
export const templates = Object.fromEntries(
  Object.entries(imports).map(([key, value]) => [
    path.basename(key, '.js'),
    value as (params: { node: AbstractNode; opts: any }) => string,
  ]),
);

class CustomConverter {
  baseConverter: Html5Converter;
  constructor(asciidoctorEngine: Asciidoctor) {
    this.baseConverter = asciidoctorEngine.Html5Converter.create();
  }

  convert(node: AbstractNode, transform?: string, opts?: any) {
    const nodeName = transform ?? node.getNodeName();
    if (nodeName in templates) {
      return templates[nodeName]({ node, opts });
    }
    console.log(`Converting ${nodeName}`);
    return this.baseConverter.convert(node, transform, opts);
  }
}

export const registerConverter = (asciidoctorEngine: Asciidoctor) => {
  asciidoctorEngine.ConverterFactory.register(new CustomConverter(asciidoctorEngine), ['html5']);
};
