// @ts-nocheck: only for building ruby code
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Builder } from 'opal-compiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function template(opalCode) {
  return `
/* eslint-disable */
// @ts-nocheck

function register() {

${opalCode}

}
export default { register };

`;
}

const builder = Builder.create();
// for all *.rb files
for (const fileName of fs.readdirSync(__dirname)) {
  if (fileName.endsWith('.rb')) {
    const opalCode = builder.build(fileName).toString();
    const jsCode = template(opalCode);
    fs.writeFileSync(fileName.replace(/.rb$/, '.js'), jsCode);
  }
}
