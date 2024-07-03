import type { Extensions } from 'asciidoctor';

import { isExtensionSingleton } from 'astro-adocx/types';

export function register(registry: typeof Extensions | Extensions.Registry) {
  if (isExtensionSingleton(registry)) {
    registry.register(function () {
      this.block(extension);
    });
  } else {
    registry.block(extension);
  }
}

function extension(this: Extensions.BlockProcessorDsl) {
  this.named('astro');
  this.onContext('pass');
  this.parseContentAs('raw');
  this.process(function (parent, reader) {
    const lines = reader.getLines().join('\n');
    return this.createPassBlock(parent, lines);
  });
}
