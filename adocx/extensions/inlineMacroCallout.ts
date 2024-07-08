import type { Extensions } from 'asciidoctor';

import { isExtensionSingleton } from '@sransara/astro-adocx/types.js';

export function register(registry: typeof Extensions | Extensions.Registry) {
  if (isExtensionSingleton(registry)) {
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
