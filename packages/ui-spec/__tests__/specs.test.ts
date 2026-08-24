import { existsSync, readdirSync, readFileSync } from 'node:fs';
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
const TOKENS_PD_CSS_DIR = resolve(HERE, '../../tokens-pd/css');
const UI_REACT_COMPONENTS_DIR = resolve(HERE, '../../ui-react/src/components/ui');

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

function listFiles(
  absDir: string,
  include: (absPath: string) => boolean,
  skipDirNames = new Set<string>()
): string[] {
  const entries = readdirSync(absDir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const absPath = resolve(absDir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirNames.has(entry.name)) continue;
      files.push(...listFiles(absPath, include, skipDirNames));
      continue;
    }
    if (include(absPath)) files.push(absPath);
  }
  return files;
}

function tokenSetFromCssDefinitions(absCssDir: string): Set<string> {
  const files = listFiles(absCssDir, (absPath) => absPath.endsWith('.css'));
  const tokens = new Set<string>();
  for (const absPath of files) {
    const css = readFileSync(absPath, 'utf8');
    for (const match of css.matchAll(/(--ui-[a-z0-9-]+)\s*:/g)) {
      tokens.add(match[1]);
    }
  }
  return tokens;
}

/**
 * Both forms a component can reference a token by: the CSS `var(--ui-x)` inside
 * an arbitrary value, and Tailwind v4's shorthand arbitrary value
 * (`outline-(--ui-x)`, `cursor-(--ui-x)`), which compiles to the same `var()`.
 */
const TOKEN_REF_RE = /(?:var\(\s*|-\()(--ui-[a-z0-9-]+)\s*\)/g;

function tokenSetFromVarRefs(absDir: string): Set<string> {
  const files = listFiles(
    absDir,
    (absPath) => absPath.endsWith('.ts') || absPath.endsWith('.tsx'),
    new Set(['__tests__', '__stories__'])
  );
  const tokens = new Set<string>();
  for (const absPath of files) {
    const source = readFileSync(absPath, 'utf8');
    for (const match of source.matchAll(TOKEN_REF_RE)) {
      tokens.add(match[1]);
    }
  }
  return tokens;
}

describe('token references resolve in tokens-pd', () => {
  const definedTokens = tokenSetFromCssDefinitions(TOKENS_PD_CSS_DIR);

  for (const name of componentNames) {
    it(`${name}: tokens.yaml names and ui-react var(--ui-*) refs are defined`, () => {
      const specTokenNames = loadSpec(name).tokens.tokens.map((token) => token.name);
      const missingSpecNames = specTokenNames.filter((token) => !definedTokens.has(token));
      expect(
        missingSpecNames,
        `${name}: tokens.yaml contains undefined tokens:\n${missingSpecNames.join('\n')}`
      ).toEqual([]);

      const sourceDir = resolve(
        UI_REACT_COMPONENTS_DIR,
        loadSpec(name).index.sourceDir ?? name
      );
      expect(existsSync(sourceDir), `${name}: missing ui-react component dir`).toBe(true);
      if (!existsSync(sourceDir)) return;

      const sourceTokenNames = [...tokenSetFromVarRefs(sourceDir)];
      const missingSourceNames = sourceTokenNames.filter(
        (token) => !definedTokens.has(token)
      );
      expect(
        missingSourceNames,
        `${name}: ui-react source has undefined --ui-* tokens:\n${missingSourceNames.join('\n')}`
      ).toEqual([]);
    });
  }
});

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

  it('ButtonGroup: api.yaml variant enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(
        HERE,
        '../../ui-react/src/components/ui/button-group/button-group.tsx'
      ),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('button-group').api;

    // `variant` (outlined / inlined) is the container's only cva axis. The item's
    // own cva declares no variants at all — Figma's `order` is derived from
    // `:last-child` and its `state`s are CSS pseudo-classes.
    expect(Object.keys(groups)).toEqual(['variant']);
    expect(groups.variant.sort()).toEqual(enumMembers(api, 'variant'));
  });

  it('PieChart: api.yaml shape enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/pie-chart/pie-chart.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('pie-chart').api;

    expect(Object.keys(groups)).toEqual(['shape']);
    expect(groups.shape.sort()).toEqual(enumMembers(api, 'shape'));
  });

  it('RadarChart: api.yaml gridType enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/radar-chart/radar-chart.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('radar-chart').api;

    expect(Object.keys(groups)).toEqual(['gridType']);
    expect(groups.gridType.sort()).toEqual(enumMembers(api, 'gridType'));
  });

  it('AreaChart: api.yaml layout/fill enums match the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/area-chart/area-chart.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('area-chart').api;

    expect(Object.keys(groups).sort()).toEqual(['fill', 'layout']);
    for (const axis of ['layout', 'fill']) {
      expect(groups[axis].sort(), axis).toEqual(enumMembers(api, axis));
    }
  });

  it('LineChart: api.yaml curve/lineStyle enums match the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/line-chart/line-chart.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('line-chart').api;

    expect(Object.keys(groups).sort()).toEqual(['curve', 'lineStyle']);
    for (const axis of ['curve', 'lineStyle']) {
      expect(groups[axis].sort(), axis).toEqual(enumMembers(api, axis));
    }
  });

  it('CategoryBar: api.yaml size enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(
        HERE,
        '../../ui-react/src/components/ui/category-bar/category-bar.tsx'
      ),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('category-bar').api;

    // `size` (sm / md / lg) is the only cva axis.
    expect(Object.keys(groups)).toEqual(['size']);
    expect(groups.size.sort()).toEqual(enumMembers(api, 'size'));
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

  it('Link: api.yaml variant enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/link/link.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('link').api;

    // `variant` (normal / inverse — Figma's `background`) is the only cva axis; the
    // Figma component has a single size.
    expect(Object.keys(groups)).toEqual(['variant']);
    expect(groups.variant.sort()).toEqual(enumMembers(api, 'variant'));
  });

  it('ButtonMenu: api.yaml variant enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/button-menu/button-menu.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('button-menu').api;

    // `variant` (primary / secondary) is the only cva axis.
    expect(Object.keys(groups)).toEqual(['variant']);
    expect(groups.variant.sort()).toEqual(enumMembers(api, 'variant'));
  });

  it('CardFilter: api.yaml variant enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(
        HERE,
        '../../ui-react/src/components/ui/card-filter/card-filter.tsx'
      ),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('card-filter').api;

    // `variant` (static / static-empty / clickable) is the only cva axis.
    expect(Object.keys(groups)).toEqual(['variant']);
    expect(groups.variant.sort()).toEqual(enumMembers(api, 'variant').sort());
  });

  it('Spinner: api.yaml size enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/spinner/spinner.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('spinner').api;

    expect(Object.keys(groups)).toEqual(['size']);
    expect(groups.size.sort()).toEqual(enumMembers(api, 'size').sort());
  });

  it('ProgressCircle: api.yaml size enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(
        HERE,
        '../../ui-react/src/components/ui/progress-circle/progress-circle.tsx'
      ),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('progress-circle').api;

    expect(Object.keys(groups)).toEqual(['size']);
    expect(groups.size.sort()).toEqual(enumMembers(api, 'size').sort());
  });

  it('Dialog: api.yaml size enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/dialog/dialog.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('dialog').api;

    // `size` (the two width steps, `sm`/`large`) is the only cva axis.
    expect(Object.keys(groups)).toEqual(['size']);
    expect(groups.size.sort()).toEqual(enumMembers(api, 'size').sort());
  });

  it('Sheet: api.yaml side enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/sheet/sheet.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('sheet').api;

    // `side` (the four edges) is the only cva axis.
    expect(Object.keys(groups)).toEqual(['side']);
    expect(groups.side.sort()).toEqual(enumMembers(api, 'side').sort());
  });

  it('Stack: api.yaml string enums match the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/stack/stack.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('stack').api;
    // wrap is a boolean axis (no string-literal enum), so it's excluded here.
    for (const axis of ['direction', 'gap', 'align', 'justify']) {
      expect(groups[axis].sort(), axis).toEqual(enumMembers(api, axis));
    }
  });

  it('Grid: api.yaml gap enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/grid/grid.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('grid').api;
    // cols is a numeric axis (no string-literal enum), so only gap is compared.
    expect(groups.gap.sort()).toEqual(enumMembers(api, 'gap'));
  });

  it('Alert: api.yaml variant enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/alert/alert.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('alert').api;

    expect(Object.keys(groups)).toEqual(['variant']);
    expect(groups.variant.sort()).toEqual(enumMembers(api, 'variant'));
  });

  // Toast's severity is not a prop — it is picked by which `toast.*` method
  // queued the notification — so the cva keys are compared against the method
  // list instead of a `variant` enum. `toast.loading` has no cva key: it has no
  // Figma variant and borrows info's chrome.
  it('Toast: api.yaml toast.* severity methods match the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/toast/toast.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('toast').api;
    const severityMethods = (api.contract.methods ?? [])
      .map((m) => m.name)
      .filter((name) => name.startsWith('toast.'))
      .map((name) => name.slice('toast.'.length))
      .filter((name) => !['loading', 'dismiss', 'promise'].includes(name))
      .sort();

    expect(Object.keys(groups)).toEqual(['variant']);
    expect(groups.variant.sort()).toEqual(severityMethods);
  });

  it('BarChart: api.yaml orientation/layout enums match the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/bar-chart/bar-chart.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('bar-chart').api;

    expect(Object.keys(groups).sort()).toEqual(['layout', 'orientation']);
    for (const axis of ['orientation', 'layout']) {
      expect(groups[axis].sort(), axis).toEqual(enumMembers(api, axis));
    }
  });

  it('FunnelChart: api.yaml lastShape enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(
        HERE,
        '../../ui-react/src/components/ui/funnel-chart/funnel-chart.tsx'
      ),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('funnel-chart').api;

    expect(Object.keys(groups)).toEqual(['lastShape']);
    expect(groups.lastShape.sort()).toEqual(enumMembers(api, 'lastShape'));
  });

  it('Field: api.yaml orientation enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/field/field.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('field').api;

    expect(Object.keys(groups)).toEqual(['orientation']);
    expect(groups.orientation.sort()).toEqual(enumMembers(api, 'orientation'));
  });

  it('Avatar: api.yaml color enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(HERE, '../../ui-react/src/components/ui/avatar/avatar.tsx'),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('avatar').api;

    // `color` (the eight Figma color schemes) is the only cva axis.
    expect(Object.keys(groups)).toEqual(['color']);
    expect(groups.color.sort()).toEqual(enumMembers(api, 'color'));
  });

  it('EmptyOverlay: api.yaml color enum matches the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(
        HERE,
        '../../ui-react/src/components/ui/empty-overlay/empty-overlay.tsx'
      ),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('empty-overlay').api;

    // `color` (the icon badge, reusing Avatar's eight color schemes) is the
    // only cva axis.
    expect(Object.keys(groups)).toEqual(['color']);
    expect(groups.color.sort()).toEqual(enumMembers(api, 'color'));
  });

  it('StepperItem: api.yaml variant/state enums match the cva keys in ui-react', () => {
    const source = readFileSync(
      resolve(
        HERE,
        '../../ui-react/src/components/ui/stepper-item/stepper-item.tsx'
      ),
      'utf8'
    );
    const groups = extractCvaGroups(source);
    const api = loadSpec('stepper-item').api;

    // Two axes: the step's role in the sequence, and its interaction look. Only
    // five of their nine combinations are drawn in Figma, but both are real
    // props, so both enums are pinned here.
    expect(Object.keys(groups)).toEqual(['variant', 'state']);
    expect(groups.variant.sort()).toEqual(enumMembers(api, 'variant'));
    expect(groups.state.sort()).toEqual(enumMembers(api, 'state'));
  });
});
