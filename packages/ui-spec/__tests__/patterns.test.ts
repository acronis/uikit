import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020';
import { load as parseYaml } from 'js-yaml';
import { describe, expect, it } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const PATTERNS_DIR = join(PKG_ROOT, 'patterns');
const UI_REACT_UI = resolve(PKG_ROOT, '../ui-react/src/components/ui');

const ajv = new Ajv2020({ strict: false, allErrors: true });
const validate = ajv.compile(
  JSON.parse(
    readFileSync(join(PKG_ROOT, 'schema', 'pattern.schema.json'), 'utf8')
  )
);

function listPatterns(): string[] {
  return readdirSync(PATTERNS_DIR)
    .filter((entry) => statSync(join(PATTERNS_DIR, entry)).isDirectory())
    .sort();
}

/** PascalCase / camelCase component name -> kebab ui-react directory. */
const toKebab = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

interface Pattern {
  name: string;
  components: string[];
}

describe('every usage pattern validates and references real components', () => {
  for (const name of listPatterns()) {
    it(`${name}/pattern.yaml`, () => {
      const data = parseYaml(
        readFileSync(join(PATTERNS_DIR, name, 'pattern.yaml'), 'utf8')
      ) as Pattern;

      expect(
        validate(data),
        ajv.errorsText(validate.errors, { separator: '\n' })
      ).toBe(true);

      // The folder name is the source of truth for the slug.
      expect(data.name).toBe(name);

      // Every composed component must exist in @acronis-platform/ui-react.
      const missing = data.components.filter(
        (comp) => !existsSync(resolve(UI_REACT_UI, toKebab(comp)))
      );
      expect(
        missing,
        `${name}: components not found in ui-react: ${missing.join(', ')}`
      ).toEqual([]);
    });
  }
});
