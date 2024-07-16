import type {
  AbstractNode,
  Block as AdocBlock,
  Document as AdocDocument,
  Inline as AdocInline,
} from 'asciidoctor';

export type AdocNodeConverter<N extends AdocBlock | AdocInline | AdocDocument> = (
  node: N,
  opts?: any,
) => string | null;

export type AdocNodeConverters = Record<
  string,
  AdocNodeConverter<AdocBlock> | AdocNodeConverter<AdocInline> | AdocNodeConverter<AdocDocument>
>;

export const register = (nodeConverters: AdocNodeConverters) => {
  // Need to use Opal to create a new class object that extends the Html5Converter
  // because the suggested compositional way to write a converter in AsciiDotor.js docs
  // has issues when loading multiple documents. The second document doesn't have the refs
  // working for some reason.

  // Following the asciidoctor.rb docs: https://docs.asciidoctor.org/asciidoctor/latest/convert/custom/#extend-and-replace-a-registered-converter
  // Create a new class object that extends the Html5Converter
  const self = Opal.klass(
    Opal.Asciidoctor.Converter,
    Opal.Asciidoctor.Converter.Html5Converter,
    'NodeConvertingConverter',
  );
  self.$register_for('html5');
  // Override the convert method
  Opal.def(
    self,
    '$convert',
    function $$convert(this: any, node: AbstractNode, transform?: string, opts?: any) {
      // See if there is a nodeConverter for the current node
      const nodeName = transform ?? node.getNodeName();
      // console.log(`Processing ${nodeName}`);
      const nodeConverter = nodeConverters[nodeName];
      if (nodeConverter !== undefined) {
        // console.log(`Found node conveter ${nodeName}`);
        // @ts-expect-error: nodeName selector should correctly pick the correct node type
        const converted = nodeConverter(node, opts);
        if (converted !== null) {
          // console.log(`Converted ${nodeName}`);
          return converted;
        }
      }
      // If nodeConverter is not found, call the super class (Html5Converter) method
      return Opal.send2(
        this,
        Opal.find_super(this, 'convert', $$convert, false, true),
        'convert',
        [node, transform, opts],
        Opal.nil,
      );
    },
  );
  return self;
};
