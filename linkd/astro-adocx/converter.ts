import type { AbstractNode, Asciidoctor, Html5Converter } from 'asciidoctor';

export type Template = {
  supports: (node: AbstractNode, opts?: any) => boolean;
  convert: (node: AbstractNode, opts?: any) => string;
};

const imports = import.meta.glob('./templates/*.ts', { eager: true });
export const builtinTemplates = Object.fromEntries(
  Object.entries(imports).map(([key, value]) => [
    key.replace('./templates/', '').replace('.ts', ''),
    value as Template,
  ]),
);

class Converter {
  baseConverter: Html5Converter;
  templates: Record<string, Template | undefined>;
  backendTraits = {
    supports_templates: false,
  };

  constructor(asciidoctorEngine: Asciidoctor, templates: Record<string, Template> = {}) {
    this.baseConverter = asciidoctorEngine.Html5Converter.create();
    this.templates = templates;
  }

  convert(node: AbstractNode, transform?: string, opts?: any) {
    const nodeName = transform ?? node.getNodeName();
    const template = this.templates[nodeName];
    if (template && template.supports(node, opts)) {
      return template.convert(node, opts);
    }
    const builtinTemplate = builtinTemplates[nodeName];
    if (builtinTemplate && builtinTemplate.supports(node, opts)) {
      return builtinTemplate.convert(node, opts);
    }
    return this.baseConverter.convert(node, transform, opts);
  }
}

export const register = (asciidoctorEngine: Asciidoctor) => {
  asciidoctorEngine.ConverterFactory.register(new Converter(asciidoctorEngine), ['html5']);
};
