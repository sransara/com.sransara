import type { Extensions } from 'asciidoctor';

export function isExtensionSingleton(registry: any): registry is typeof Extensions {
  return typeof registry.register === 'function';
}
