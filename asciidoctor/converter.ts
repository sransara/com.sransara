// @ts-nocheck
class CustomConverter {
  constructor(asciidoctorEngine) {
    this.baseConverter = asciidoctorEngine.Html5Converter.create();
  }
  convert(node, transform) {
    const base = this.baseConverter.convert(node, transform);
    if (node.getNodeName() !== 'inline_quoted') {
      return base;
    }
    if (!['asciimath', 'latexmath'].includes(node.getType())) {
      return base;
    }
    return `<span class="math" data-lang="${node.getType()}">${node.getText()}</span>`;
  }
}

export const register = (asciidoctorEngine) => {
  asciidoctorEngine.ConverterFactory.register(new CustomConverter(asciidoctorEngine), ['html5']);
};
