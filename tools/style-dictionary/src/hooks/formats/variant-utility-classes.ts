// Framework-agnostic state-variant utility classes: a generic multiplier
// (class-list × variant-list) over the semantic color utility classes, per
// PLTFRM-94106's explicit design: "build variant-compiling as a generic
// multiplier, not case-by-case... pick a fixed variant set and apply it to a
// fixed class subset (color/opacity utilities), so any new color class
// automatically gets its hover/disabled forms." Naming mirrors Tailwind's own
// `variant:utility` syntax (`ui-hover:text-warning`) — the colon is escaped
// in the CSS selector (`.ui-hover\:text-warning`), exactly like Tailwind's
// own compiled output, and matches an unescaped
// `className="ui-hover:text-warning"`.

const VARIANTS: ReadonlyArray<readonly [string, string]> = [
  ['hover', ':hover'],
  ['disabled', ':disabled'],
  ['focus-visible', ':focus-visible'],
  ['last', ':last-child'],
];

/**
 * Multiply every class in `classes` (selector `.ui-{name}`) by the fixed
 * variant set, producing `.ui-{variant}\:{name}{pseudo}` for each. Generic
 * over whatever class-list is passed in — a future class subset (e.g.
 * opacity utilities) gets variant forms for free by calling this, no change
 * needed here.
 */
export function withStateVariants(classes: ReadonlyMap<string, string>): Map<string, string> {
  const out = new Map<string, string>();
  for (const [selector, block] of classes) {
    if (!selector.startsWith('.ui-')) continue; // guard: only wrap `.ui-*` classes
    const name = selector.slice('.ui-'.length);
    for (const [variant, pseudo] of VARIANTS) {
      out.set(`.ui-${variant}\\:${name}${pseudo}`, block);
    }
  }
  return out;
}
