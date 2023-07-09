export function calloutMacroRegisterHandle(registry) {
  registry.register(function () {
    this.inlineMacro('callout', function () {
      const self = this;
      self.process((parent, target) => self.createInline(parent, 'callout', target));
    });
  });
}
