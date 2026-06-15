/**
 * Token data layer for the kitchen sink, sourced from
 * `@acronis-platform/tokens-pd` — the generated `--ui-*` CSS.
 *
 * `@acronis-platform/ui-react/styles` already loads the **semantic** acronis
 * tokens (`css/acronis.css`). It does NOT bundle the **per-component** token
 * files (`css/<component>/acronis.css`), so we load those here — both to render
 * the components correctly and to enumerate their `--ui-<component>-*` names.
 *
 * acronis is the only brand: its semantic tokens are the base layer (no
 * override stylesheet). Light/dark is driven by the tokens' `light-dark()` +
 * `color-scheme`, so we flip `color-scheme` (and mirror `[data-theme]` for
 * ui-react's `dark:` variant).
 */

// --- acronis: semantic is applied by ui-react/styles; we read it here only to
//     enumerate names. Per-component files we both apply + read.
import semanticAcronis from '@acronis-platform/tokens-pd/css/acronis.css?raw';
import breadcrumbAcronis from '@acronis-platform/tokens-pd/css/Breadcrumb/acronis.css?raw';
import buttonAcronis from '@acronis-platform/tokens-pd/css/Button/acronis.css?raw';
import buttonIconAcronis from '@acronis-platform/tokens-pd/css/ButtonIcon/acronis.css?raw';
import checkboxAcronis from '@acronis-platform/tokens-pd/css/Checkbox/acronis.css?raw';
import inputTextAcronis from '@acronis-platform/tokens-pd/css/InputText/acronis.css?raw';
import sidebarPrimaryAcronis from '@acronis-platform/tokens-pd/css/SidebarPrimary/acronis.css?raw';
import sidebarSecondaryAcronis from '@acronis-platform/tokens-pd/css/SidebarSecondary/acronis.css?raw';
import switchAcronis from '@acronis-platform/tokens-pd/css/Switch/acronis.css?raw';
import tagAcronis from '@acronis-platform/tokens-pd/css/Tag/acronis.css?raw';
import tooltipAcronis from '@acronis-platform/tokens-pd/css/Tooltip/acronis.css?raw';

export type ColorMode = 'light' | 'dark';

/** A row of tokens that share a role (paints `bg` / `text` / `border` / …). */
export interface RoleGroup {
  /** Normalized role: `bg` | `text` | `border` | `glyph` | `focus`. */
  role: string;
  /** `name` is the full custom property; `leaf` is the part after the
   *  role+context prefix (e.g. `primary-hover`) for a compact card label. */
  tokens: { name: string; leaf: string }[];
}

/** Semantic tokens for one context (`surface`, `brand`, `status`, …),
 *  split into role rows. */
export interface ContextGroup {
  context: string;
  /** Total tokens across all role rows (for the heading count). */
  count: number;
  roles: RoleGroup[];
}

/** Per-component token CSS (not bundled by ui-react/styles). */
const COMPONENT_SOURCES: { tier: string; css: string }[] = [
  { tier: 'breadcrumb', css: breadcrumbAcronis },
  { tier: 'button', css: buttonAcronis },
  { tier: 'button-icon', css: buttonIconAcronis },
  { tier: 'checkbox', css: checkboxAcronis },
  { tier: 'input-text', css: inputTextAcronis },
  { tier: 'sidebar-primary', css: sidebarPrimaryAcronis },
  { tier: 'sidebar-secondary', css: sidebarSecondaryAcronis },
  { tier: 'switch', css: switchAcronis },
  { tier: 'tag', css: tagAcronis },
  { tier: 'tooltip', css: tooltipAcronis },
];

/** Extract the unique `--ui-*` custom-property names declared in a CSS string. */
function tokenNames(css: string): string[] {
  const set = new Set<string>();
  for (const m of css.matchAll(/(--ui-[a-z0-9-]+)\s*:/g)) set.add(m[1]);
  return [...set].sort();
}

/**
 * Semantic token taxonomy. Every name is `--ui-<role>-<context>-…`:
 *   - background tokens read context directly  (`background-<context>-…`)
 *   - text/border/glyph read it after `on-`     (`text-on-<context>-…`)
 *   - focus has no context and is its own group (`focus-…`)
 * We group by **context** first (how designers reason — "colors that live on a
 * surface"), then by **role** within, so a surface's bg/text/border/glyph sit
 * together instead of in four separate mega-buckets.
 */
const ROLE_LABEL: Record<string, string> = {
  background: 'bg',
  text: 'text',
  border: 'border',
  glyph: 'glyph',
  focus: 'focus',
};
const CONTEXT_ORDER = [
  'surface',
  'brand',
  'status',
  'inverted',
  'overlay',
  'ai',
  'focus',
];
const ROLE_ORDER = ['bg', 'text', 'border', 'glyph', 'focus'];

/** Order states as a progression instead of alphabetically. */
const STATE_RANK: Record<string, number> = {
  idle: 1,
  default: 1,
  hover: 2,
  active: 3,
  pressed: 4,
  disabled: 5,
};

function parseToken(name: string): {
  context: string;
  role: string;
  leaf: string;
} {
  const segs = name.slice('--ui-'.length).split('-');
  const role0 = segs[0];
  if (role0 === 'focus') {
    return { context: 'focus', role: 'focus', leaf: segs.slice(1).join('-') };
  }
  if (role0 === 'background') {
    return { context: segs[1], role: 'bg', leaf: segs.slice(2).join('-') };
  }
  // text | border | glyph — context follows the `on-` marker.
  const hasOn = segs[1] === 'on';
  const context = hasOn ? segs[2] : segs[1];
  const leaf = segs.slice(hasOn ? 3 : 2).join('-');
  return { context, role: ROLE_LABEL[role0] ?? role0, leaf };
}

/**
 * Sort tokens within a group by their `leaf` (the part after the role/context
 * prefix): named variants first (idle → … → disabled within each), then any
 * bare context-root state. Operating on the leaf — and ranking a state with no
 * variant *after* named variants — keeps `primary` ahead of a root-level
 * `hover`/`active` (whose stripped "base" is the context itself, which would
 * otherwise sort first as a prefix).
 */
function compareLeaf(a: string, b: string): number {
  const key = (leaf: string): [string, number] => {
    const segs = leaf.split('-');
    const last = segs[segs.length - 1];
    if (last in STATE_RANK) {
      const variant = segs.slice(0, -1).join('-');
      // `￿` sorts after any real variant name → root-level states last.
      return [variant === '' ? '￿' : variant, STATE_RANK[last]];
    }
    return [leaf, 0];
  };
  const [ba, ra] = key(a);
  const [bb, rb] = key(b);
  return ba === bb ? ra - rb : ba < bb ? -1 : 1;
}

/** Position in a fixed order array; unknowns sort last, then alphabetically. */
function ordered<T extends string>(order: T[]) {
  return (a: T, b: T): number => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia !== ib) return (ia < 0 ? order.length : ia) - (ib < 0 ? order.length : ib);
    return a < b ? -1 : a > b ? 1 : 0;
  };
}

/** Semantic colors grouped by context → role. */
export const semanticContextGroups: ContextGroup[] = (() => {
  const byContext = new Map<string, Map<string, string[]>>();
  for (const name of tokenNames(semanticAcronis)) {
    const { context, role } = parseToken(name);
    const roles = byContext.get(context) ?? new Map<string, string[]>();
    (roles.get(role) ?? roles.set(role, []).get(role)!).push(name);
    byContext.set(context, roles);
  }
  const ctxSort = ordered(CONTEXT_ORDER);
  const roleSort = ordered(ROLE_ORDER);
  return [...byContext.entries()]
    .sort(([a], [b]) => ctxSort(a, b))
    .map(([context, roles]) => {
      const roleGroups = [...roles.entries()]
        .sort(([a], [b]) => roleSort(a, b))
        .map(([role, names]) => ({
          role,
          tokens: names
            .map((name) => ({ name, leaf: parseToken(name).leaf || name }))
            .sort((x, y) => compareLeaf(x.leaf, y.leaf)),
        }));
      return {
        context,
        count: roleGroups.reduce((n, r) => n + r.tokens.length, 0),
        roles: roleGroups,
      };
    });
})();

// ---- Token matrix ---------------------------------------------------------
// Some token families follow a regular row × (role/state) grid — status by
// intent, button by variant — and read far better as a matrix than as flat
// swatch rows. The model below is shared by both.

/** What a column paints, so the cell can render an apt preview. */
export type MatrixCellKind = 'fill' | 'border' | 'text' | 'glyph';

export interface MatrixColumnGroup {
  label: string;
  kind: MatrixCellKind;
  /** Column headers within the group (e.g. `idle` / `hover` / `pressed`). */
  columns: string[];
  /** row key → token name per column (`null` when that cell has no token). */
  cells: Record<string, (string | null)[]>;
}

export interface TokenMatrix {
  /** Row keys (status intents, button variants, …). */
  rows: string[];
  groups: MatrixColumnGroup[];
}

interface MatrixSpec {
  label: string;
  kind: MatrixCellKind;
  columns: string[];
  name: (row: string, column: string) => string | null;
}

function buildMatrix(rows: string[], specs: MatrixSpec[]): TokenMatrix {
  return {
    rows,
    groups: specs.map((spec) => ({
      label: spec.label,
      kind: spec.kind,
      columns: spec.columns,
      cells: Object.fromEntries(
        rows.map((row) => [row, spec.columns.map((c) => spec.name(row, c))])
      ),
    })),
  };
}

/** Collect every non-null token name a matrix references. */
function matrixNames(matrix: TokenMatrix): Set<string> {
  const names = new Set<string>();
  for (const g of matrix.groups)
    for (const row of Object.values(g.cells))
      for (const n of row) if (n) names.add(n);
  return names;
}

// ---- Status matrix --------------------------------------------------------
// Status is the largest semantic context and every intent exists for every
// role. Non-intent status tokens (on/off, link, primary, …) don't fit the grid
// and are surfaced separately as `statusExtras`.

const STATUS_INTENTS = [
  'critical',
  'danger',
  'info',
  'success',
  'warning',
  'neutral',
];

const statusNameSet = new Set(
  (semanticContextGroups.find((g) => g.context === 'status')?.roles ?? [])
    .flatMap((r) => r.tokens)
    .map((t) => t.name)
);
const pickStatus = (name: string): string | null =>
  statusNameSet.has(name) ? name : null;

export const statusMatrix: TokenMatrix = buildMatrix(STATUS_INTENTS, [
  {
    label: 'Background',
    kind: 'fill',
    columns: ['idle', 'hover', 'pressed'],
    name: (i, c) =>
      pickStatus(`--ui-background-status-${i}${c === 'idle' ? '' : `-${c}`}`),
  },
  {
    label: 'Background · strong',
    kind: 'fill',
    columns: ['idle', 'hover', 'pressed'],
    name: (i, c) =>
      pickStatus(
        `--ui-background-status-strong-${i}${c === 'idle' ? '' : `-${c}`}`
      ),
  },
  {
    label: 'Border',
    kind: 'border',
    columns: ['base', 'strong'],
    name: (i, c) =>
      pickStatus(`--ui-border-on-status-${i}${c === 'base' ? '' : `-${c}`}`),
  },
  { label: 'Text', kind: 'text', columns: ['base'], name: (i) => pickStatus(`--ui-text-on-status-${i}`) },
  { label: 'Glyph', kind: 'glyph', columns: ['base'], name: (i) => pickStatus(`--ui-glyph-on-status-${i}`) },
]);

/** Subset a set of role groups to the tokens not covered by a matrix. */
function extrasFrom(roles: RoleGroup[], matrix: TokenMatrix): RoleGroup[] {
  const covered = matrixNames(matrix);
  return roles
    .map((r) => ({
      role: r.role,
      tokens: r.tokens.filter((t) => !covered.has(t.name)),
    }))
    .filter((r) => r.tokens.length > 0);
}

/** Status tokens not represented in the matrix (on/off, link, primary, …),
 *  grouped by role for a normal swatch listing below the matrix. */
export const statusExtras: RoleGroup[] = extrasFrom(
  semanticContextGroups.find((g) => g.context === 'status')?.roles ?? [],
  statusMatrix
);

// ---- Component tokens -----------------------------------------------------
// Same idea as the semantic context → role grouping: each component is split
// into sub-groups (the segment after the component name — a variant like
// `primary`, a part like `circle`, or a dimension bucket like `global`), each
// rendered as a state-ordered row. Dimension buckets sort last.

const DIMENSION_SUBGROUPS = ['global', 'units', 'nesting'];

/** Sub-group + leaf for a component token (`--ui-<component>-<sub>-<leaf…>`). */
function parseComponentToken(
  tier: string,
  name: string
): { subgroup: string; leaf: string } {
  const rest = name.slice(`--ui-${tier}-`.length).split('-');
  const subgroup = rest[0] ?? name;
  const leaf = rest.slice(1).join('-') || rest[0] || name;
  return { subgroup, leaf };
}

/** Color/variant sub-groups first (alphabetical), dimension buckets last. */
function compareSubgroup(a: string, b: string): number {
  const ia = DIMENSION_SUBGROUPS.indexOf(a);
  const ib = DIMENSION_SUBGROUPS.indexOf(b);
  if ((ia < 0) !== (ib < 0)) return ia < 0 ? -1 : 1;
  if (ia < 0) return a < b ? -1 : a > b ? 1 : 0;
  return ia - ib;
}

export interface ComponentTokenGroup {
  /** Component name / tier, e.g. `button`. */
  component: string;
  count: number;
  subgroups: RoleGroup[];
}

/** Per-component groups (`--ui-button-*`, `--ui-switch-*`, …). */
export const componentGroups: ComponentTokenGroup[] = COMPONENT_SOURCES.map(
  (s) => {
    const bySub = new Map<string, { name: string; leaf: string }[]>();
    for (const name of tokenNames(s.css)) {
      const { subgroup, leaf } = parseComponentToken(s.tier, name);
      const list = bySub.get(subgroup) ?? [];
      list.push({ name, leaf });
      bySub.set(subgroup, list);
    }
    const subgroups = [...bySub.entries()]
      .sort(([a], [b]) => compareSubgroup(a, b))
      .map(([role, tokens]) => ({
        role,
        tokens: tokens.sort((x, y) => compareLeaf(x.leaf, y.leaf)),
      }));
    return {
      component: s.tier,
      count: subgroups.reduce((n, r) => n + r.tokens.length, 0),
      subgroups,
    };
  }
);

// ---- Button matrix --------------------------------------------------------
// Button is the one component with a fully regular variant × role × state grid
// (`--ui-button-<variant>-<role>-<state>`), so it gets the matrix treatment.
// Its non-variant `global-*` dimension tokens fall out as `buttonExtras`.

const BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'ghost',
  'destructive',
  'inverted',
  'ai',
];
const BUTTON_STATES = ['idle', 'hover', 'active', 'disabled'];

const buttonNameSet = new Set(tokenNames(buttonAcronis));
const pickButton = (name: string): string | null =>
  buttonNameSet.has(name) ? name : null;

export const buttonMatrix: TokenMatrix = buildMatrix(
  BUTTON_VARIANTS,
  (
    [
      ['Container', 'fill', 'container'],
      ['Border', 'border', 'container-border-color'],
      ['Icon', 'glyph', 'icon'],
      ['Label', 'text', 'label'],
    ] as const
  ).map(([label, kind, role]) => ({
    label,
    kind,
    columns: BUTTON_STATES,
    name: (variant, state) => pickButton(`--ui-button-${variant}-${role}-${state}`),
  }))
);

/** Button tokens not in the matrix (`global-*` dimensions). */
export const buttonExtras: RoleGroup[] = extrasFrom(
  componentGroups.find((g) => g.component === 'button')?.subgroups ?? [],
  buttonMatrix
);

export interface TypographyStyle {
  /** e.g. `ui-typography-body-default`. */
  className: string;
  /** First segment, e.g. `body`, `headings`, `link`. */
  group: string;
  /** Remaining segments, e.g. `default`, `form-label`, `default-underline`. */
  variant: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

/**
 * Typography tokens are emitted as `.ui-typography-*` utility classes (in the
 * semantic CSS, already applied by ui-react/styles), not custom properties.
 * Parse the class rules so the demo can show each style + its metrics.
 */
export const typographyStyles: TypographyStyle[] = (() => {
  const out: TypographyStyle[] = [];
  const blockRe = /\.(ui-typography-[a-z0-9-]+)\s*\{([^}]*)\}/g;
  for (const m of semanticAcronis.matchAll(blockRe)) {
    const className = m[1];
    const decls: Record<string, string> = {};
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':');
      if (i === -1) continue;
      decls[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
    const parts = className.slice('ui-typography-'.length).split('-');
    out.push({
      className,
      group: parts[0],
      variant: parts.slice(1).join('-'),
      fontFamily: decls['font-family'] ?? '',
      fontSize: decls['font-size'] ?? '',
      fontWeight: decls['font-weight'] ?? '',
      lineHeight: decls['line-height'] ?? '',
      letterSpacing: decls['letter-spacing'] ?? '',
    });
  }
  return out;
})();

const COMPONENT_TOKENS_STYLE_ID = 'ks-component-tokens';

/** Apply the per-component token CSS once (ui-react/styles omits it). */
function injectComponentTokens(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(COMPONENT_TOKENS_STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = COMPONENT_TOKENS_STYLE_ID;
  el.textContent = COMPONENT_SOURCES.map((s) => s.css).join('\n');
  document.head.appendChild(el);
}
injectComponentTokens();

/** Flip light/dark: `color-scheme` drives `light-dark()`; `[data-theme]` drives ui-react's `dark:`. */
export function applyTheme(mode: ColorMode): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.dataset.theme = mode;
  html.style.colorScheme = mode;
}

/**
 * Resolve a CSS custom property's current value (theme-aware — reflects the
 * active brand/scheme on the document).
 */
export function resolveToken(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
