import type {
  AbstractNode,
  Block as AdocBlock,
  Document as AdocDocument,
  Inline as AdocInline,
  Asciidoctor,
  Html5Converter,
} from 'asciidoctor';

export type AdocNodeConverter<N extends AdocBlock | AdocInline | AdocDocument> = (
  node: N,
  opts?: any,
) => string | null;

export type AdocNodeConverters = Record<
  string,
  AdocNodeConverter<AdocBlock> | AdocNodeConverter<AdocInline> | AdocNodeConverter<AdocDocument>
>;

class NodeConvertingConverter {
  baseConverter: Html5Converter;
  nodeConverters: AdocNodeConverters;
  backendTraits = {
    supports_templates: false,
  };

  constructor(asciidoctorEngine: Asciidoctor, nodeConverters: AdocNodeConverters) {
    this.baseConverter = asciidoctorEngine.Html5Converter.create();
    this.nodeConverters = nodeConverters;
  }

  convert(node: AbstractNode, transform?: string, opts?: any) {
    const nodeName = transform ?? node.getNodeName();
    // console.log(`Processing ${nodeName}`);
    const nodeConverter = this.nodeConverters[nodeName];
    if (nodeConverter !== undefined) {
      // console.log(`Found node conveter ${nodeName}`);
      // @ts-expect-error: nodeName selector should correctly pick the correct node type
      const converted = nodeConverter(node, opts);
      if (converted !== null) {
        return converted;
      }
    }
    // console.log(`Using default backend converter for ${nodeName}`);
    return this.baseConverter.convert(node, transform, opts);
  }
}

export const register = (asciidoctorEngine: Asciidoctor, nodeConverters: AdocNodeConverters) => {
  const converter = new NodeConvertingConverter(asciidoctorEngine, nodeConverters ?? {});
  asciidoctorEngine.ConverterFactory.register(converter, ['html5']);
};
