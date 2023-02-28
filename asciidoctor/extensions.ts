// @ts-nocheck
export function calloutMacroRegisterHandle(registry) {
  registry.register(function () {
    this.inlineMacro('callout', function () {
      var self = this;
      self.process(function (parent, target) {
        return self.createInline(parent, 'callout', target);
      });
    });
  });
}
