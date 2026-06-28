import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';
import { describe, expect, it } from 'vitest';

import { getRule } from '../grammar';
import { formatScreenReport, runScreenAudit } from '../screens/audit';
import { DETECTORS } from '../screens/audit/detectors';
import type {
  ScreenDescriptorLite,
  ScreenSnapshot,
  SnapshotNode,
} from '../screens/audit/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCREENS_DIR = resolve(HERE, '../screens');

// ── snapshot factory ─────────────────────────────────────────────────────────
let seq = 0;
function node(partial: Partial<SnapshotNode>): SnapshotNode {
  seq += 1;
  return {
    ref: partial.ref ?? `node-${seq}`,
    tag: partial.tag ?? 'div',
    role: partial.role ?? null,
    region: partial.region ?? null,
    regionChild: partial.regionChild ?? false,
    text: partial.text ?? '',
    accessibleName: partial.accessibleName ?? null,
    interactive: partial.interactive ?? false,
    disabled: partial.disabled ?? false,
    isIcon: partial.isIcon ?? false,
    rect: partial.rect ?? { x: 0, y: 0, width: 100, height: 32 },
    opacity: partial.opacity ?? 1,
    color: partial.color ?? 'rgb(20, 20, 20)',
    backgroundColor: partial.backgroundColor ?? 'rgb(255, 255, 255)',
    fontSize: partial.fontSize ?? 14,
    fontWeight: partial.fontWeight ?? 400,
    borderRadius: partial.borderRadius ?? 6,
    gutterX: partial.gutterX ?? 0,
    gutterY: partial.gutterY ?? 0,
  };
}

function snapshot(nodes: SnapshotNode[]): ScreenSnapshot {
  return {
    screen: 'test',
    colorMode: 'light',
    viewport: { width: 1280, height: 800 },
    nodes,
  };
}

const run = (snap: ScreenSnapshot, descriptor: ScreenDescriptorLite) =>
  runScreenAudit(snap, descriptor);

const ids = (snap: ScreenSnapshot, descriptor: ScreenDescriptorLite) =>
  run(snap, descriptor).map((f) => f.ruleId);

// A descriptor with one region (banner) opting into every region-scoped rule, so
// the region detectors all fire when their defect is present.
const everyRule: ScreenDescriptorLite = {
  name: 'test',
  regions: [
    {
      regionId: 'bar',
      ariaRole: 'banner',
      rules: [
        'spacing/control-height-parity',
        'spacing/icon-size-parity',
        'spacing/radius-parity',
        'accessibility/tab-order',
        'composition/edge-baseline-alignment',
        'composition/vertical-rhythm',
        'composition/no-clipping',
      ],
    },
  ],
};

// ── registry integrity ───────────────────────────────────────────────────────
describe('screen-audit detector registry', () => {
  it('every detector enforces a real grammar rule flagged as screen-detected', () => {
    for (const d of DETECTORS) {
      const rule = getRule(d.ruleId);
      expect(rule, `unknown rule ${d.ruleId}`).toBeTruthy();
      // The rule's `detector` field must mark it as enforced by the screen audit.
      expect(rule?.detector.startsWith('screen/'), `${d.ruleId} → ${rule?.detector}`).toBe(true);
    }
  });

  it('detector rule ids are unique', () => {
    const seen = new Set(DETECTORS.map((d) => d.ruleId));
    expect(seen.size).toBe(DETECTORS.length);
  });
});

// ── clean snapshot → no findings ─────────────────────────────────────────────
describe('a coherent screen produces no findings', () => {
  it('passes a clean banner', () => {
    const clean = snapshot([
      node({ region: 'banner', interactive: true, tag: 'button', text: 'Save', rect: { x: 16, y: 12, width: 80, height: 32 } }),
      node({ region: 'banner', interactive: true, tag: 'button', text: 'Cancel', rect: { x: 104, y: 12, width: 80, height: 32 } }),
      node({ region: 'banner', isIcon: true, tag: 'svg', rect: { x: 200, y: 18, width: 16, height: 16 } }),
      node({ region: 'banner', isIcon: true, tag: 'svg', rect: { x: 224, y: 18, width: 16, height: 16 } }),
    ]);
    expect(ids(clean, everyRule)).toEqual([]);
  });
});

// ── per-detector behavior ────────────────────────────────────────────────────
describe('Z2 control-height-parity', () => {
  it('flags mismatched control heights in one row', () => {
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'button', text: 'A', rect: { x: 0, y: 10, width: 80, height: 32 } }),
      node({ region: 'banner', interactive: true, tag: 'input', accessibleName: 'q', rect: { x: 90, y: 8, width: 200, height: 40 } }),
    ]);
    expect(ids(snap, everyRule)).toContain('spacing/control-height-parity');
  });

  it('ignores controls on different rows', () => {
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'button', text: 'A', rect: { x: 0, y: 0, width: 80, height: 32 } }),
      node({ region: 'banner', interactive: true, tag: 'input', accessibleName: 'q', rect: { x: 0, y: 100, width: 200, height: 40 } }),
    ]);
    expect(ids(snap, everyRule)).not.toContain('spacing/control-height-parity');
  });
});

describe('Z6 icon-size-parity', () => {
  it('flags mixed icon sizes in a cluster', () => {
    const snap = snapshot([
      node({ region: 'banner', isIcon: true, tag: 'svg', rect: { x: 0, y: 10, width: 16, height: 16 } }),
      node({ region: 'banner', isIcon: true, tag: 'svg', rect: { x: 24, y: 8, width: 20, height: 20 } }),
    ]);
    expect(ids(snap, everyRule)).toContain('spacing/icon-size-parity');
  });
});

describe('Z3 radius-parity', () => {
  it('flags sibling controls with mismatched radii in a row', () => {
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'button', text: 'A', rect: { x: 0, y: 10, width: 80, height: 32 }, borderRadius: 6 }),
      node({ region: 'banner', interactive: true, tag: 'button', text: 'B', rect: { x: 90, y: 10, width: 80, height: 32 }, borderRadius: 16 }),
    ]);
    expect(ids(snap, everyRule)).toContain('spacing/radius-parity');
  });

  it('passes equal radii', () => {
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'button', text: 'A', rect: { x: 0, y: 10, width: 80, height: 32 }, borderRadius: 6 }),
      node({ region: 'banner', interactive: true, tag: 'button', text: 'B', rect: { x: 90, y: 10, width: 80, height: 32 }, borderRadius: 6 }),
    ]);
    expect(ids(snap, everyRule)).not.toContain('spacing/radius-parity');
  });
});

describe('A2 disabled-treatment (screen scope)', () => {
  const noRules: ScreenDescriptorLite = { name: 'test', regions: [{ regionId: 'x', ariaRole: 'main' }] };

  it('flags a mix of opacity-dimmed and token-dimmed disabled controls', () => {
    const snap = snapshot([
      node({ disabled: true, tag: 'button', accessibleName: 'A', opacity: 0.5 }),
      node({ disabled: true, tag: 'button', accessibleName: 'B', opacity: 1 }),
    ]);
    expect(ids(snap, noRules)).toContain('anatomy/disabled-parity');
  });

  it('passes when all disabled controls share one treatment', () => {
    const snap = snapshot([
      node({ disabled: true, tag: 'button', accessibleName: 'A', opacity: 0.5 }),
      node({ disabled: true, tag: 'button', accessibleName: 'B', opacity: 0.5 }),
    ]);
    expect(ids(snap, noRules)).not.toContain('anatomy/disabled-parity');
  });
});

describe('I4 tab-order', () => {
  it('flags a focusable element visually above one earlier in the tab order', () => {
    // DOM order: A then B; but B sits entirely above A.
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'a', text: 'A', rect: { x: 0, y: 100, width: 80, height: 32 } }),
      node({ region: 'banner', interactive: true, tag: 'a', text: 'B', rect: { x: 0, y: 0, width: 80, height: 32 } }),
    ]);
    expect(ids(snap, everyRule)).toContain('accessibility/tab-order');
  });

  it('accepts DOM order matching top-to-bottom visual order', () => {
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'a', text: 'A', rect: { x: 0, y: 0, width: 80, height: 32 } }),
      node({ region: 'banner', interactive: true, tag: 'a', text: 'B', rect: { x: 0, y: 100, width: 80, height: 32 } }),
    ]);
    expect(ids(snap, everyRule)).not.toContain('accessibility/tab-order');
  });
});

describe('C2 edge-baseline-alignment', () => {
  it('flags near-miss left edges', () => {
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'button', text: 'A', rect: { x: 16, y: 0, width: 80, height: 32 } }),
      node({ region: 'banner', role: 'heading', tag: 'h2', text: 'Title', rect: { x: 19, y: 40, width: 200, height: 24 } }),
    ]);
    expect(ids(snap, everyRule)).toContain('composition/edge-baseline-alignment');
  });

  it('does not flag exactly-aligned edges', () => {
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'button', text: 'A', rect: { x: 16, y: 0, width: 80, height: 32 } }),
      node({ region: 'banner', role: 'heading', tag: 'h2', text: 'Title', rect: { x: 16, y: 40, width: 200, height: 24 } }),
    ]);
    expect(ids(snap, everyRule)).not.toContain('composition/edge-baseline-alignment');
  });
});

describe('C1 vertical-rhythm', () => {
  it('flags an off-grid section gap', () => {
    const snap = snapshot([
      node({ region: 'banner', regionChild: true, rect: { x: 0, y: 0, width: 400, height: 50 } }),
      node({ region: 'banner', regionChild: true, rect: { x: 0, y: 63, width: 400, height: 50 } }), // 13px gap
    ]);
    expect(ids(snap, everyRule)).toContain('composition/vertical-rhythm');
  });

  it('accepts a 4px-grid gap', () => {
    const snap = snapshot([
      node({ region: 'banner', regionChild: true, rect: { x: 0, y: 0, width: 400, height: 50 } }),
      node({ region: 'banner', regionChild: true, rect: { x: 0, y: 66, width: 400, height: 50 } }), // 16px gap
    ]);
    expect(ids(snap, everyRule)).not.toContain('composition/vertical-rhythm');
  });
});

describe('C8 no-clipping (reserved gutter)', () => {
  it('flags a reserved scrollbar gutter', () => {
    const snap = snapshot([
      node({ region: 'banner', tag: 'div', gutterX: 11, rect: { x: 0, y: 0, width: 240, height: 600 } }),
    ]);
    expect(ids(snap, everyRule)).toContain('composition/no-clipping');
  });
});

describe('I1 accessible-name (screen scope)', () => {
  const noRules: ScreenDescriptorLite = { name: 'test', regions: [{ regionId: 'x', ariaRole: 'main' }] };

  it('flags an interactive node with no name or text', () => {
    const snap = snapshot([node({ interactive: true, tag: 'button', role: 'button' })]);
    expect(ids(snap, noRules)).toContain('accessibility/accessible-name');
  });

  it('passes a labelled control even with no region opt-in', () => {
    const snap = snapshot([node({ interactive: true, tag: 'button', accessibleName: 'Close' })]);
    expect(ids(snap, noRules)).not.toContain('accessibility/accessible-name');
  });
});

describe('I5 contrast (screen scope)', () => {
  const noRules: ScreenDescriptorLite = { name: 'test', regions: [{ regionId: 'x', ariaRole: 'main' }] };

  it('flags low-contrast body text', () => {
    const snap = snapshot([
      node({ text: 'Hard to read', color: 'rgb(180, 180, 180)', backgroundColor: 'rgb(255, 255, 255)', fontSize: 14 }),
    ]);
    expect(ids(snap, noRules)).toContain('accessibility/contrast');
  });

  it('passes high-contrast body text', () => {
    const snap = snapshot([
      node({ text: 'Readable', color: 'rgb(20, 20, 20)', backgroundColor: 'rgb(255, 255, 255)', fontSize: 14 }),
    ]);
    expect(ids(snap, noRules)).not.toContain('accessibility/contrast');
  });

  it('applies the relaxed large-text threshold', () => {
    // 3.5:1 — fails for body (4.5) but passes for large bold (3).
    const grey = 'rgb(130, 130, 130)';
    const small = snapshot([node({ text: 'small', color: grey, fontSize: 14 })]);
    const large = snapshot([node({ text: 'large', color: grey, fontSize: 28, fontWeight: 700 })]);
    expect(ids(small, noRules)).toContain('accessibility/contrast');
    expect(ids(large, noRules)).not.toContain('accessibility/contrast');
  });
});

// ── findings carry registry severity + checklist ─────────────────────────────
describe('findings resolve against the registry', () => {
  it('every finding mirrors its rule severity + checklist row', () => {
    const snap = snapshot([
      node({ region: 'banner', interactive: true, tag: 'button', text: 'A', rect: { x: 0, y: 10, width: 80, height: 32 } }),
      node({ region: 'banner', interactive: true, tag: 'input', accessibleName: 'q', rect: { x: 90, y: 8, width: 200, height: 40 } }),
    ]);
    const findings = run(snap, everyRule);
    expect(findings.length).toBeGreaterThan(0);
    for (const f of findings) {
      const rule = getRule(f.ruleId)!;
      expect(f.severity).toBe(rule.severity);
      expect(f.checklist).toBe(rule.checklist);
    }
  });
});

// ── end-to-end against the real protection-dashboard descriptor ──────────────
describe('runs against the shipped protection-dashboard descriptor', () => {
  const descriptor = parseYaml(
    readFileSync(join(SCREENS_DIR, 'protection-dashboard', 'screen.yaml'), 'utf8')
  ) as ScreenDescriptorLite;

  it('surfaces region-scoped defects only where that region opts in', () => {
    // header opts into control-height-parity; sidebar opts into no-clipping.
    const snap = snapshot([
      // header: two mismatched controls in a row
      node({ region: 'banner', interactive: true, tag: 'button', text: 'Go', rect: { x: 0, y: 10, width: 60, height: 28 } }),
      node({ region: 'banner', interactive: true, tag: 'input', accessibleName: 'Search', rect: { x: 70, y: 8, width: 300, height: 40 } }),
      // sidebar: a reserved scrollbar gutter
      node({ region: 'navigation', tag: 'div', gutterX: 11, rect: { x: 0, y: 0, width: 240, height: 700 } }),
    ]);
    const found = ids(snap, descriptor);
    expect(found).toContain('spacing/control-height-parity'); // header
    expect(found).toContain('composition/no-clipping'); // sidebar
  });

  it('formats a readable report', () => {
    const snap = snapshot([
      node({ interactive: true, tag: 'button', role: 'button' }), // unnamed → must
    ]);
    const report = formatScreenReport(run(snap, descriptor), 'protection-dashboard');
    expect(report).toContain('MUST');
    expect(report).toContain('protection-dashboard');
  });
});
