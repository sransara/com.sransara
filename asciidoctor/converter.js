class InlineMath {
  static match(node) {
    return (
      node.getNodeName() === 'inline_quoted' && ['asciimath', 'latexmath'].includes(node.getType())
    );
  }

  static convert(node, _transform, _opts) {
    return `<span class="math" data-lang="${node.getType()}">${node.getText()}</span>`;
  }
}

class CustomConverter {
  constructor(asciidoctorEngine) {
    this.baseConverter = asciidoctorEngine.Html5Converter.create();
  }

  convert(node, transform, opts) {
    if (InlineMath.match(node)) {
      return InlineMath.convert(node, transform, opts);
    }

    return this.baseConverter.convert(node, transform, opts);
  }
}

export const register = (asciidoctorEngine) => {
  asciidoctorEngine.ConverterFactory.register(new CustomConverter(asciidoctorEngine), ['html5']);
};
