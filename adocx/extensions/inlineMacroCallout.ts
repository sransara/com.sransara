import type { Extensions } from 'asciidoctor';

import { isExtensionRegistrySingleton } from '@sransara/astro-adocx/utils/extension';

export function register(registry: typeof Extensions | Extensions.Registry) {
  if (isExtensionRegistrySingleton(registry)) {
    registry.register(function () {
      this.inlineMacro('callout', extension);
    });
  } else {
    registry.inlineMacro('callout', extension);
  }
}

function extension(this: Extensions.InlineMacroProcessorDsl) {
  this.process(function (parent, target) {
    return this.createInline(parent, 'callout', target);
  });
}
