// Structural screen detectors (Phase 3).
//
// Each detector enforces one `screen/*` grammar rule over a `ScreenSnapshot`.
// They are PURE — snapshot in, findings out — so they are unit-tested in Node
// without a browser (the snapshot is the seam; see ./types.ts). Findings are
// keyed by grammar rule id; the rule supplies severity + checklist row, so an
// invariant is defined exactly once in the registry. `must` findings fail CI.
//
// Add a detector by appending to DETECTORS and pointing its grammar rule's
// `detector` field at the matching `screen/<id>`. A rule whose detector is not
// implemented here is simply not enforced (no false confidence) — mirrors kit-lint.
import { getRule } from '../../grammar';
import type { ScreenFinding, SnapshotNode } from './types';

/** Detectors run either once over the whole screen, or per opted-in region. */
export interface ScreenDetector {
  ruleId: string;
  scope: 'screen' | 'region';
  /** `nodes` are pre-filtered to the region for `region` scope, else all nodes. */
  run(nodes: SnapshotNode[]): Omit<ScreenFinding, 'severity' | 'checklist'>[];
}

function find(
  ruleId: string,
  node: { ref: string; region: string | null } | string,
  message: string
): Omit<ScreenFinding, 'severity' | 'checklist'> {
  const ref = typeof node === 'string' ? node : node.ref;
  const region = typeof node === 'string' ? null : node.region;
  return { ruleId, region, ref, message };
}

/** Cluster nodes into visual rows by vertical overlap (sorted top-to-bottom). */
function rows(nodes: SnapshotNode[]): SnapshotNode[][] {
  const sorted = [...nodes].sort((a, b) => a.rect.y - b.rect.y);
  const out: SnapshotNode[][] = [];
  for (const n of sorted) {
    const row = out.find((r) => {
      const m = r[r.length - 1];
      const aTop = n.rect.y;
      const aBot = n.rect.y + n.rect.height;
      const bTop = m.rect.y;
      const bBot = m.rect.y + m.rect.height;
      const overlap = Math.min(aBot, bBot) - Math.max(aTop, bTop);
      return overlap > Math.min(n.rect.height, m.rect.height) / 2;
    });
    if (row) row.push(n);
    else out.push([n]);
  }
  return out;
}

/** Group near-equal numbers into buckets within `tol`; returns the bucket count. */
function distinct(values: number[], tol: number): number[] {
  const reps: number[] = [];
  for (const v of [...values].sort((a, b) => a - b)) {
    if (!reps.some((r) => Math.abs(r - v) <= tol)) reps.push(v);
  }
  return reps;
}

function parseRgb(c: string): [number, number, number] | null {
  const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg: string, bg: string): number | null {
  const a = parseRgb(fg);
  const b = parseRgb(bg);
  if (!a || !b) return null;
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const isHeading = (n: SnapshotNode): boolean =>
  n.role === 'heading' || /^h[1-6]$/.test(n.tag);

export const DETECTORS: ScreenDetector[] = [
  // Z2 — controls placed in one row must share height within a size tier.
  {
    ruleId: 'spacing/control-height-parity',
    scope: 'region',
    run(nodes) {
      const out: Omit<ScreenFinding, 'severity' | 'checklist'>[] = [];
      for (const row of rows(nodes.filter((n) => n.interactive && n.rect.height > 0))) {
        if (row.length < 2) continue;
        const heights = distinct(row.map((n) => n.rect.height), 2);
        if (heights.length > 1) {
          const tallest = row.reduce((a, b) => (a.rect.height >= b.rect.height ? a : b));
          out.push(
            find(
              'spacing/control-height-parity',
              tallest,
              `controls in one row have ${heights.length} different heights (${heights.join('/')}px) — align to a single size tier`
            )
          );
        }
      }
      return out;
    },
  },

  // Z6 — icons within a cluster (row) share one size.
  {
    ruleId: 'spacing/icon-size-parity',
    scope: 'region',
    run(nodes) {
      const out: Omit<ScreenFinding, 'severity' | 'checklist'>[] = [];
      for (const row of rows(nodes.filter((n) => n.isIcon))) {
        if (row.length < 2) continue;
        const sizes = distinct(
          row.map((n) => Math.max(n.rect.width, n.rect.height)),
          1
        );
        if (sizes.length > 1) {
          out.push(
            find(
              'spacing/icon-size-parity',
              row[0],
              `icons in one cluster mix ${sizes.length} sizes (${sizes.join('/')}px) — use one icon size per cluster`
            )
          );
        }
      }
      return out;
    },
  },

  // Z3 — sibling controls in a row share a border-radius.
  {
    ruleId: 'spacing/radius-parity',
    scope: 'region',
    run(nodes) {
      const out: Omit<ScreenFinding, 'severity' | 'checklist'>[] = [];
      const controls = nodes.filter(
        (n) => (n.interactive || n.disabled) && n.rect.height > 0
      );
      for (const row of rows(controls)) {
        if (row.length < 2) continue;
        const radii = distinct(row.map((n) => n.borderRadius), 1);
        if (radii.length > 1) {
          out.push(
            find(
              'spacing/radius-parity',
              row[0],
              `sibling controls in one row use ${radii.length} different border-radii (${radii.join('/')}px) — share one radius`
            )
          );
        }
      }
      return out;
    },
  },

  // A2 — disabled controls across the screen use ONE treatment, not a mix
  // (some dimmed via opacity, some via a token color).
  {
    ruleId: 'anatomy/disabled-parity',
    scope: 'screen',
    run(nodes) {
      const disabled = nodes.filter((n) => n.disabled);
      if (disabled.length < 2) return [];
      const viaOpacity = disabled.filter((n) => n.opacity < 0.99);
      if (viaOpacity.length === 0 || viaOpacity.length === disabled.length) {
        return [];
      }
      return [
        find(
          'anatomy/disabled-parity',
          viaOpacity[0],
          `disabled controls use mixed treatments (${viaOpacity.length} dim via opacity, ${disabled.length - viaOpacity.length} via a token) — pick one disabled treatment`
        ),
      ];
    },
  },

  // I4 — tab (DOM) order follows visual order: no focusable element sits visually
  // above another it comes after in source.
  {
    ruleId: 'accessibility/tab-order',
    scope: 'region',
    run(nodes) {
      const out: Omit<ScreenFinding, 'severity' | 'checklist'>[] = [];
      // `nodes` preserve DOM (document) order from the probe's tree walk.
      const focusable = nodes.filter((n) => n.interactive);
      for (let i = 0; i < focusable.length; i += 1) {
        const a = focusable[i];
        for (let j = i + 1; j < focusable.length; j += 1) {
          const b = focusable[j];
          // b comes later in the tab order but sits entirely above a.
          if (b.rect.y + b.rect.height <= a.rect.y) {
            out.push(
              find(
                'accessibility/tab-order',
                b,
                `tab order does not match visual order — this control is above an earlier-focused one (y=${b.rect.y} vs y=${a.rect.y})`
              )
            );
            break;
          }
        }
      }
      return out;
    },
  },

  // C2 — adjacent components' left edges align, or are equal — never near-misses.
  {
    ruleId: 'composition/edge-baseline-alignment',
    scope: 'region',
    run(nodes) {
      const out: Omit<ScreenFinding, 'severity' | 'checklist'>[] = [];
      const candidates = nodes.filter((n) => n.interactive || isHeading(n));
      const edges = distinct(candidates.map((n) => n.rect.x), 0).sort((a, b) => a - b);
      for (let i = 1; i < edges.length; i += 1) {
        const delta = edges[i] - edges[i - 1];
        if (delta >= 1 && delta <= 6) {
          const node = candidates.find((n) => n.rect.x === edges[i]) ?? candidates[0];
          out.push(
            find(
              'composition/edge-baseline-alignment',
              node,
              `left edges nearly align (x=${edges[i - 1]} vs x=${edges[i]}, off by ${delta}px) — snap to the same edge`
            )
          );
        }
      }
      return out;
    },
  },

  // C1 — vertical gaps between a region's sections come from the 4px grid.
  {
    ruleId: 'composition/vertical-rhythm',
    scope: 'region',
    run(nodes) {
      const out: Omit<ScreenFinding, 'severity' | 'checklist'>[] = [];
      const sections = nodes
        .filter((n) => n.regionChild && n.rect.height > 0)
        .sort((a, b) => a.rect.y - b.rect.y);
      for (let i = 1; i < sections.length; i += 1) {
        const prev = sections[i - 1];
        const gap = sections[i].rect.y - (prev.rect.y + prev.rect.height);
        if (gap > 0 && gap % 4 !== 0) {
          out.push(
            find(
              'composition/vertical-rhythm',
              sections[i],
              `section gap is ${gap}px — off the 4px vertical-rhythm grid`
            )
          );
        }
      }
      return out;
    },
  },

  // C8 — scroll containers must not reserve a gutter that can crop full-bleed content.
  {
    ruleId: 'composition/no-clipping',
    scope: 'region',
    run(nodes) {
      const out: Omit<ScreenFinding, 'severity' | 'checklist'>[] = [];
      for (const n of nodes) {
        if (n.gutterX >= 1 || n.gutterY >= 1) {
          const px = Math.max(n.gutterX, n.gutterY);
          out.push(
            find(
              'composition/no-clipping',
              n,
              `scroll container reserves a ${px}px scrollbar gutter — use an overlay scrollbar so it cannot crop full-bleed content`
            )
          );
        }
      }
      return out;
    },
  },

  // I1 — every interactive element has an accessible name.
  {
    ruleId: 'accessibility/accessible-name',
    scope: 'screen',
    run(nodes) {
      return nodes
        .filter(
          (n) =>
            n.interactive &&
            !(n.accessibleName && n.accessibleName.trim()) &&
            !(n.text && n.text.trim())
        )
        .map((n) =>
          find(
            'accessibility/accessible-name',
            n,
            `interactive <${n.tag}>${n.role ? ` role="${n.role}"` : ''} has no accessible name`
          )
        );
    },
  },

  // I5 — text meets the WCAG contrast minimum against its effective background.
  {
    ruleId: 'accessibility/contrast',
    scope: 'screen',
    run(nodes) {
      const out: Omit<ScreenFinding, 'severity' | 'checklist'>[] = [];
      for (const n of nodes) {
        if (!n.text || !n.text.trim() || n.isIcon) continue;
        const ratio = contrastRatio(n.color, n.backgroundColor);
        if (ratio == null) continue;
        const large = n.fontSize >= 24 || (n.fontSize >= 18.66 && n.fontWeight >= 700);
        const min = large ? 3 : 4.5;
        if (ratio < min) {
          out.push(
            find(
              'accessibility/contrast',
              n,
              `text contrast ${ratio.toFixed(2)}:1 is below the ${min}:1 minimum (${n.color} on ${n.backgroundColor})`
            )
          );
        }
      }
      return out;
    },
  },
];

/** Resolve severity + checklist row for a detector finding from the registry. */
export function resolveFinding(
  partial: Omit<ScreenFinding, 'severity' | 'checklist'>
): ScreenFinding {
  const rule = getRule(partial.ruleId);
  if (!rule) throw new Error(`screen-audit references unknown rule "${partial.ruleId}"`);
  return { ...partial, severity: rule.severity, checklist: rule.checklist };
}
