/**
 * Token data layer for the kitchen sink, sourced from
 * `@acronis-platform/tokens-pd` — the generated `--ui-*` CSS.
 *
 * `@acronis-platform/ui-react/styles` already loads the **semantic** acronis
 * tokens (`css/acronis.css`). It does NOT bundle the **per-component** token
 * files (`css/<component>/acronis.css`), so we load those here — both to render
 * the components correctly and to enumerate their `--ui-<component>-*` names.
 *
 * Brand switching: `brand-b` ships *override-only* CSS scoped to `:root`, so a
 * brand is applied by injecting its override stylesheet (not a class toggle).
 * Light/dark is driven by the tokens' `light-dark()` + `color-scheme`, so we
 * flip `color-scheme` (and mirror `[data-theme]` for ui-react's `dark:` variant).
 */

// --- acronis (default brand): semantic is applied by ui-react/styles; we read
//     it here only to enumerate names. Per-component files we both apply + read.
import semanticAcronis from '@acronis-platform/tokens-pd/css/acronis.css?raw';
import breadcrumbAcronis from '@acronis-platform/tokens-pd/css/breadcrumb/acronis.css?raw';
import buttonAcronis from '@acronis-platform/tokens-pd/css/button/acronis.css?raw';
import chipAcronis from '@acronis-platform/tokens-pd/css/chip/acronis.css?raw';
import formAcronis from '@acronis-platform/tokens-pd/css/form/acronis.css?raw';
import iconAcronis from '@acronis-platform/tokens-pd/css/icon/acronis.css?raw';
import itemAcronis from '@acronis-platform/tokens-pd/css/item/acronis.css?raw';
import menuItemAcronis from '@acronis-platform/tokens-pd/css/menu-item/acronis.css?raw';
import switchAcronis from '@acronis-platform/tokens-pd/css/switch/acronis.css?raw';
import tagAcronis from '@acronis-platform/tokens-pd/css/tag/acronis.css?raw';
import tooltipAcronis from '@acronis-platform/tokens-pd/css/tooltip/acronis.css?raw';
import treeAcronis from '@acronis-platform/tokens-pd/css/tree/acronis.css?raw';

// --- brand-b: override-only CSS, applied on demand.
import semanticBrandB from '@acronis-platform/tokens-pd/css/brand-b.css?raw';
import breadcrumbBrandB from '@acronis-platform/tokens-pd/css/breadcrumb/brand-b.css?raw';
import buttonBrandB from '@acronis-platform/tokens-pd/css/button/brand-b.css?raw';
import chipBrandB from '@acronis-platform/tokens-pd/css/chip/brand-b.css?raw';
import formBrandB from '@acronis-platform/tokens-pd/css/form/brand-b.css?raw';
import iconBrandB from '@acronis-platform/tokens-pd/css/icon/brand-b.css?raw';
import itemBrandB from '@acronis-platform/tokens-pd/css/item/brand-b.css?raw';
import menuItemBrandB from '@acronis-platform/tokens-pd/css/menu-item/brand-b.css?raw';
import switchBrandB from '@acronis-platform/tokens-pd/css/switch/brand-b.css?raw';
import tagBrandB from '@acronis-platform/tokens-pd/css/tag/brand-b.css?raw';
import tooltipBrandB from '@acronis-platform/tokens-pd/css/tooltip/brand-b.css?raw';
import treeBrandB from '@acronis-platform/tokens-pd/css/tree/brand-b.css?raw';

export type Brand = 'acronis' | 'brand-b';
export type ColorMode = 'light' | 'dark';

export const BRANDS: Brand[] = ['acronis', 'brand-b'];
export const DEFAULT_BRAND: Brand = 'acronis';

export interface TokenGroup {
  /** First path segment after `--ui-` (e.g. `button`, `background`). */
  tier: string;
  tokens: { name: string }[];
}

/** Per-component token CSS (not bundled by ui-react/styles). */
const COMPONENT_SOURCES: { tier: string; css: string }[] = [
  { tier: 'breadcrumb', css: breadcrumbAcronis },
  { tier: 'button', css: buttonAcronis },
  { tier: 'chip', css: chipAcronis },
  { tier: 'form', css: formAcronis },
  { tier: 'icon', css: iconAcronis },
  { tier: 'item', css: itemAcronis },
  { tier: 'menu-item', css: menuItemAcronis },
  { tier: 'switch', css: switchAcronis },
  { tier: 'tag', css: tagAcronis },
  { tier: 'tooltip', css: tooltipAcronis },
  { tier: 'tree', css: treeAcronis },
];

const BRAND_B_CSS = [
  semanticBrandB,
  breadcrumbBrandB,
  buttonBrandB,
  chipBrandB,
  formBrandB,
  iconBrandB,
  itemBrandB,
  menuItemBrandB,
  switchBrandB,
  tagBrandB,
  tooltipBrandB,
  treeBrandB,
].join('\n');

/** Extract the unique `--ui-*` custom-property names declared in a CSS string. */
function tokenNames(css: string): string[] {
  const set = new Set<string>();
  for (const m of css.matchAll(/(--ui-[a-z0-9-]+)\s*:/g)) set.add(m[1]);
  return [...set].sort();
}

/** Semantic groups (`--ui-background-*`, `--ui-text-*`, …), grouped by tier. */
export const semanticGroups: TokenGroup[] = (() => {
  const byTier = new Map<string, string[]>();
  for (const name of tokenNames(semanticAcronis)) {
    const tier = name.slice('--ui-'.length).split('-')[0];
    const list = byTier.get(tier) ?? [];
    list.push(name);
    byTier.set(tier, list);
  }
  return [...byTier.entries()].map(([tier, names]) => ({
    tier,
    tokens: names.map((name) => ({ name })),
  }));
})();

/** Per-component groups (`--ui-button-*`, `--ui-switch-*`, …). */
export const componentGroups: TokenGroup[] = COMPONENT_SOURCES.map((s) => ({
  tier: s.tier,
  tokens: tokenNames(s.css).map((name) => ({ name })),
}));

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

/** How many tokens a non-default brand overrides. */
export function brandOverrideCount(brand: Brand): number {
  return brand === DEFAULT_BRAND ? 0 : tokenNames(BRAND_B_CSS).length;
}

const COMPONENT_TOKENS_STYLE_ID = 'ks-component-tokens';
const BRAND_OVERRIDES_STYLE_ID = 'ks-brand-overrides';

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

/** Apply a brand by injecting (or removing) its `:root` override stylesheet. */
export function applyBrand(brand: Brand): void {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(BRAND_OVERRIDES_STYLE_ID);
  if (brand === DEFAULT_BRAND) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement('style');
  el.id = BRAND_OVERRIDES_STYLE_ID;
  el.textContent = BRAND_B_CSS;
  // Append last so brand overrides win over the base `:root` declarations.
  document.head.appendChild(el);
}

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
