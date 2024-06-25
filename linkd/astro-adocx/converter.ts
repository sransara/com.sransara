import type { AbstractNode, Asciidoctor, Html5Converter } from 'asciidoctor';
import { parseHTML } from 'linkedom';

function postProcessImage(html: string) {
  const { document } = parseHTML(html);
  return html;
}

class CustomConverter {
  baseConverter: Html5Converter;
  backendTraits: { supports_templates: boolean };

  constructor(asciidoctorEngine: Asciidoctor) {
    this.backendTraits = {
      supports_templates: true,
    };
    this.baseConverter = asciidoctorEngine.Html5Converter.create();
  }

  convert(node: AbstractNode, transform?: string, opts?: any) {
    const nodeName = transform ?? node.getNodeName();
    console.log(`Converting ${nodeName}`);
    const converted = this.baseConverter.convert(node, transform, opts);
    if (nodeName === 'image') {
      return postProcessImage(converted);
    } else {
      return converted;
    }
  }
}

export const registerConverter = (asciidoctorEngine: Asciidoctor) => {
  asciidoctorEngine.ConverterFactory.register(new CustomConverter(asciidoctorEngine), ['html5']);
};
