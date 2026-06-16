import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020';
import { describe, expect, it } from 'vitest';

import { extractCvaGroups } from '../lib/cva';
import {
  YAML_FILES,
  listComponentNames,
  loadSpec,
  readSchema,
  readYaml,
  specFilePath,
  type YamlFile,
} from '../lib/load';
import type { ApiSpec } from '../types';

const ajv = new Ajv2020({ strict: false, allErrors: true });
const validators = Object.fromEntries(
  YAML_FILES.map((file) => [file, ajv.compile(readSchema(file))])
) as Record<YamlFile, ReturnType<typeof ajv.compile>>;

const componentNames = listComponentNames();
const HERE = dirname(fileURLToPath(import.meta.url));

describe('every component spec validates against its schema', () => {
  for (const name of componentNames) {
    for (const file of YAML_FILES) {
      it(`${name}/${file}.yaml`, () => {
        const data = readYaml<unknown>(specFilePath(name, file));
        const valid = validators[file](data);
        expect(
          valid,
          ajv.errorsText(validators[file].errors, { separator: '\n' })
        ).toBe(true);
      });
    }
  }
});

describe('anatomy schematic depicts every declared part', () => {
  for (const name of componentNames) {
    it(`${name}/anatomy.yaml schematic`, () => {
      const { anatomy } = loadSpec(name);
      expect(anatomy.schematic, `${name} has no schematic`).toBeTruthy();
      const schematic = anatomy.schematic ?? '';
      for (const part of anatomy.parts) {
        expect(
          schematic.includes(part.id),
          `part "${part.id}" is not labelled in the schematic`
        ).toBe(true);
      }
    });
  }
});

describe('state classification is coherent', () => {
  for (const name of componentNames) {
    it(`${name}: each state's kind lines up with the spec`, () => {
      const { anatomy, api } = loadSpec(name);
      const propNames = new Set(api.contract.properties.map((p) => p.name));
      for (const s of anatomy.states ?? []) {
        if (s.kind === 'pseudo') {
          expect(s.pseudo, `${name}/${s.id} (pseudo) needs a pseudo selector`).toBeTruthy();
        }
        if (s.kind === 'prop') {
          expect(s.prop, `${name}/${s.id} (prop) needs a prop name`).toBeTruthy();
          expect(
            propNames.has(s.prop ?? ''),
            `${name}/${s.id} references unknown prop "${s.prop}"`
          ).toBe(true);
        }
        if (s.kind === 'internal') {
          expect(
            (anatomy.internal_state ?? []).length,
            `${name}/${s.id} is internal but no internal_state is declared`
          ).toBeGreaterThan(0);
        }
      }
      // Internal state must be wired to the real API: its controlling prop, its
      // uncontrolled-default prop, and its change event must all exist.
      const eventNames = new Set((api.contract.events ?? []).map((e) => e.name));
      const internalIds = new Set((anatomy.internal_state ?? []).map((s) => s.id));
      for (const st of anatomy.internal_state ?? []) {
        for (const prop of st.controllable_via ?? []) {
          expect(
            propNames.has(prop),
            `${name}: internal_state "${st.id}" controllable_via unknown prop "${prop}"`
          ).toBe(true);
        }
        if (st.controlled_default) {
          expect(
            propNames.has(st.controlled_default),
            `${name}: internal_state "${st.id}" controlled_default unknown prop "${st.controlled_default}"`
          ).toBe(true);
        }
        if (st.emits) {
          expect(
            eventNames.has(st.emits),
            `${name}: internal_state "${st.id}" emits unknown event "${st.emits}"`
          ).toBe(true);
        }
      }

      // Every transition must mutate a declared internal state.
      for (const t of anatomy.transitions ?? []) {
        expect(
          internalIds.has(t.state),
          `${name}: transition "${t.id}" targets unknown internal_state "${t.state}"`
        ).toBe(true);
      }
    });
  }
});

/** Pull the string-union members out of an `api.yaml` property `type`. */
function enumMembers(api: ApiSpec, propName: string): string[] {
  const prop = api.contract.properties.find((p) => p.name === propName);
  if (!prop) return [];
  return [...prop.type.matchAll(/'([^']+)'/g)].map((m) => m[1]).sort();
}

describe('cva ↔ contract conformance', () => {
  it('Button: api.yaml variant enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/button/button.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('button').api;

    // The Figma button has a single size, so `variant` is the only cva axis.
    expect(Object.keys(groups)).toEqual(['variant']);
    expect(groups.variant.sort()).toEqual(enumMembers(api, 'variant'));
  });

  it('ButtonIcon: api.yaml variant enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(
        HERE,
        '../../ui-react/src/components/ui/button-icon/button-icon.tsx'
      ),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('button-icon').api;

    // `variant` (ghost / secondary) is the only cva axis.
    expect(Object.keys(groups)).toEqual(['variant']);
    expect(groups.variant.sort()).toEqual(enumMembers(api, 'variant'));
  });
});
