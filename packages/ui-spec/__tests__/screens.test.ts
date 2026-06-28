import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020';
import { load as parseYaml } from 'js-yaml';
import { describe, expect, it } from 'vitest';

import { getRule } from '../grammar';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const SCREENS_DIR = join(PKG_ROOT, 'screens');
const PATTERNS_DIR = join(PKG_ROOT, 'patterns');
const UI_REACT_UI = resolve(PKG_ROOT, '../ui-react/src/components/ui');

const ajv = new Ajv2020({ strict: false, allErrors: true });
const validate = ajv.compile(
  JSON.parse(readFileSync(join(PKG_ROOT, 'schema', 'screen.schema.json'), 'utf8'))
);

const toKebab = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

interface Region {
  rules?: string[];
  components?: { component: string }[];
  children?: Region[];
}
interface Screen {
  name: string;
  pattern?: string;
  regions: Region[];
  stateMachine: {
    states: { name: string; initial?: boolean; rules?: string[] }[];
    transitions: { from: string; to: string }[];
  };
}

function listScreens(): string[] {
  if (!existsSync(SCREENS_DIR)) return [];
  return readdirSync(SCREENS_DIR)
    .filter(
      (e) =>
        statSync(join(SCREENS_DIR, e)).isDirectory() &&
        existsSync(join(SCREENS_DIR, e, 'screen.yaml'))
    )
    .sort();
}

function walkRegions(regions: Region[], visit: (r: Region) => void): void {
  for (const r of regions) {
    visit(r);
    if (r.children) walkRegions(r.children, visit);
  }
}

describe('every screen descriptor validates and references real things', () => {
  for (const name of listScreens()) {
    const screen = parseYaml(
      readFileSync(join(SCREENS_DIR, name, 'screen.yaml'), 'utf8')
    ) as Screen;

    it(`${name}: schema + slug`, () => {
      expect(validate(screen), ajv.errorsText(validate.errors, { separator: '\n' })).toBe(true);
      expect(screen.name).toBe(name);
    });

    it(`${name}: referenced components exist in ui-react`, () => {
      const components = new Set<string>();
      walkRegions(screen.regions, (r) =>
        r.components?.forEach((c) => components.add(c.component))
      );
      const missing = [...components].filter(
        (c) => !existsSync(resolve(UI_REACT_UI, toKebab(c)))
      );
      expect(missing, `components not found in ui-react: ${missing.join(', ')}`).toEqual([]);
    });

    it(`${name}: referenced grammar rules resolve`, () => {
      const ruleIds = new Set<string>();
      walkRegions(screen.regions, (r) => r.rules?.forEach((id) => ruleIds.add(id)));
      screen.stateMachine.states.forEach((s) => s.rules?.forEach((id) => ruleIds.add(id)));
      const missing = [...ruleIds].filter((id) => !getRule(id));
      expect(missing, `unknown grammar rules: ${missing.join(', ')}`).toEqual([]);
    });

    it(`${name}: pattern reference exists (if any)`, () => {
      if (screen.pattern)
        expect(
          existsSync(join(PATTERNS_DIR, screen.pattern)),
          `unknown pattern "${screen.pattern}"`
        ).toBe(true);
    });

    it(`${name}: state machine has one initial, valid + reachable states`, () => {
      const states = screen.stateMachine.states;
      const names = new Set(states.map((s) => s.name));
      expect(states.filter((s) => s.initial).length, 'exactly one initial state').toBe(1);
      expect(new Set(states.map((s) => s.name)).size, 'unique state names').toBe(states.length);

      for (const t of screen.stateMachine.transitions) {
        expect(names.has(t.from), `transition from unknown state "${t.from}"`).toBe(true);
        expect(names.has(t.to), `transition to unknown state "${t.to}"`).toBe(true);
      }

      // Every non-initial state is reachable from the initial state.
      const initial = states.find((s) => s.initial)!.name;
      const reached = new Set([initial]);
      let grew = true;
      while (grew) {
        grew = false;
        for (const t of screen.stateMachine.transitions) {
          if (reached.has(t.from) && !reached.has(t.to)) {
            reached.add(t.to);
            grew = true;
          }
        }
      }
      const dead = states.map((s) => s.name).filter((n) => !reached.has(n));
      expect(dead, `unreachable states: ${dead.join(', ')}`).toEqual([]);
    });
  }
});
