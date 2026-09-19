// Framework-agnostic position utility classes: position-type declarations
// (static, fixed set) and offset classes (top/right/bottom/left/inset, …)
// generated from the same `units.gap.*` scale that backs spacing/sizing (see
// `gap-utility-classes.ts`/`sizing-utility-classes.ts`) — for consumers who
// don't extend the Tailwind preset. Offsets alone (PLTFRM-94106 cited
// `right-2`/`top-full`) are unusable without a position-type declaration, so
// both ship together.

/** Static position-type utility classes, emitted once per build. */
export const STATIC_POSITION_TYPE_CLASSES: ReadonlyMap<string, string> = new Map([
  ['.ui-static', 'position: static;'],
  ['.ui-relative', 'position: relative;'],
  ['.ui-absolute', 'position: absolute;'],
  ['.ui-fixed', 'position: fixed;'],
  ['.ui-sticky', 'position: sticky;'],
]);

// `left`/`right` are physical — do not mirror under dir="rtl". `start`/`end`
// (inset-inline-start/end) are their logical equivalents and should be
// preferred for anything that should mirror in RTL, same guidance as the
// ps/pe vs pl/pr spacing prefixes.
const OFFSET_DIRECTIONS: Record<string, string> = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  start: 'inset-inline-start',
  end: 'inset-inline-end',
  inset: 'inset',
  'inset-x': 'inset-inline',
  'inset-y': 'inset-block',
};

/**
 * Selector→block entries for one resolved gap size: the full offset grammar
 * at that size, all referencing the same custom property the spacing/sizing
 * utilities already emit.
 */
export function offsetUtilityClasses(varName: string, sizeKey: string): Map<string, string> {
  const classes = new Map<string, string>();
  const value = `var(--${varName})`;

  for (const [prefix, property] of Object.entries(OFFSET_DIRECTIONS)) {
    classes.set(`.ui-${prefix}-${sizeKey}`, `${property}: ${value};`);
  }

  return classes;
}

/** Static, non-scale "full" (100%) offset utility classes, emitted once per build. */
export const STATIC_OFFSET_CLASSES: ReadonlyMap<string, string> = new Map(
  Object.entries(OFFSET_DIRECTIONS).map(([prefix, property]) => [
    `.ui-${prefix}-full`,
    `${property}: 100%;`,
  ])
);
