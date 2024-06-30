/**
 * Convert a string to snake_case
 */
export function snakeCase(string: string): string {
  return string
    .toLowerCase()
    .replace(/[^0-9a-z]+/g, '_')
    .replace(/^_+|_+$/, '');
}
