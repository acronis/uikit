// Screen-audit data model (Phase 3 of the kit-consistency proposal).
//
// The audit splits *measurement* from *detection*, exactly like `kit-lint`:
//   1. a browser probe (./probe.ts, run via `page.evaluate`) renders a real
//      screen and emits a serializable `ScreenSnapshot` (geometry, computed
//      style, a11y, scrollbar gutters — no DOM handles);
//   2. pure detectors (./detectors.ts) run over that snapshot + the screen
//      descriptor and emit findings keyed by grammar rule id + severity.
//
// Step 2 is plain data-in/data-out, so it is unit-testable in Node without a
// browser — the snapshot is the seam. See context/kit-consistency-audit-proposal.md §7.
import type { RuleSeverity } from '../../grammar';

export interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** One measured DOM element in a rendered screen. */
export interface SnapshotNode {
  /** Short CSS-ish locator for reporting (e.g. `header > button:nth-of-type(2)`). */
  ref: string;
  /** Lowercased tag name. */
  tag: string;
  /** Explicit or implicit ARIA role, if any. */
  role: string | null;
  /**
   * Landmark role of the nearest landmark ancestor — `banner` | `navigation` |
   * `main` | `complementary` | `contentinfo` | `region` | `search` — or null.
   * Detectors scope region-level rules by matching this to a descriptor
   * region's `ariaRole`.
   */
  region: string | null;
  /** True when this element is a direct child of its region's landmark element. */
  regionChild: boolean;
  /** Trimmed, truncated text content. */
  text: string;
  /** Computed accessible name (aria-label / labelledby / alt / title / text). */
  accessibleName: string | null;
  /** An enabled control the user operates (button, link, input, select, …). */
  interactive: boolean;
  /** A control that is present but disabled (`disabled` / `aria-disabled`). */
  disabled: boolean;
  /** An icon glyph (svg / `[data-slot="icon"]`). */
  isIcon: boolean;
  rect: NodeRect;
  /** Computed opacity (0–1) — used to tell apart disabled treatments. */
  opacity: number;
  /** Computed `color`, normalized `rgb(...)`/`rgba(...)`. */
  color: string;
  /** First non-transparent background found walking ancestors (the effective bg). */
  backgroundColor: string;
  fontSize: number;
  fontWeight: number;
  borderRadius: number;
  /** Reserved vertical-scrollbar gutter (px), net of borders — 0 if none/overlay. */
  gutterX: number;
  /** Reserved horizontal-scrollbar gutter (px), net of borders. */
  gutterY: number;
}

export interface ScreenSnapshot {
  /** Screen slug (`screens/<slug>`). */
  screen: string;
  /** Storybook story id the snapshot was captured from, if any. */
  story?: string;
  colorMode: 'light' | 'dark';
  viewport: { width: number; height: number };
  nodes: SnapshotNode[];
}

/** A single audit finding — same shape contract as `kit-lint`'s `Finding`. */
export interface ScreenFinding {
  ruleId: string;
  checklist: string;
  severity: RuleSeverity;
  /** Descriptor region the finding belongs to (regionId), or null for screen-wide. */
  region: string | null;
  /** Node locator (or a synthetic cluster description). */
  ref: string;
  message: string;
}

/** Minimal view of a screen descriptor the audit needs (loaded from screen.yaml). */
export interface ScreenRegionLite {
  regionId: string;
  ariaRole?: string;
  rules?: string[];
  children?: ScreenRegionLite[];
}

export interface ScreenDescriptorLite {
  name: string;
  story?: string;
  regions: ScreenRegionLite[];
}
