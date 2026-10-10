// Framework-agnostic width/height utility classes, generated from the same
// `units.gap.*` primitive scale that backs the padding/margin/gap grammar (see
// `gap-utility-classes.ts` and `context/output.md`) — for consumers who don't
// extend the Tailwind preset. Named `.ui-{property}-{size}`, mirroring the gap
// grammar's naming so the two families read consistently.

const SIZING_DIRECTIONS: Record<string, string> = {
  w: 'width',
  h: 'height',
  'min-w': 'min-width',
  'min-h': 'min-height',
  'max-w': 'max-width',
  'max-h': 'max-height',
};

/**
 * Selector→block entries for one resolved gap size: the full width/height
 * grammar at that size, all referencing the same custom property the gap
 * utilities already emit — so a brand override (were gap ever to gain one)
 * only needs to change the variable, not every class.
 */
export function sizingUtilityClasses(varName: string, sizeKey: string): Map<string, string> {
  const classes = new Map<string, string>();
  const value = `var(--${varName})`;

  for (const [prefix, property] of Object.entries(SIZING_DIRECTIONS)) {
    classes.set(`.ui-${prefix}-${sizeKey}`, `${property}: ${value};`);
  }

  return classes;
}

/** Static, non-token-driven utility emitted once per build (not per size). */
export const STATIC_SIZING_CLASSES: ReadonlyMap<string, string> = new Map([
  ['.ui-max-w-full', 'max-width: 100%;'],
]);
