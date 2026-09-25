// Framework-agnostic child-spacing utility classes: `ui-space-y-*` (generated
// from the same `units.gap.*` scale as spacing/sizing/position) and the
// static `ui-divide-y` (a single fixed value, using the already-established
// `--ui-border-on-surface-divider` token — the same one used for divider
// borders elsewhere, e.g. the spacing Storybook demo). Both use Tailwind's
// own `:not([hidden]) ~ :not([hidden])` child combinator so a `hidden`
// sibling doesn't get (or contribute) a spurious margin/border.

const CHILD_COMBINATOR = '> :not([hidden]) ~ :not([hidden])';

/**
 * Selector→block entry for one resolved gap size: vertical spacing between
 * children, referencing the same custom property the spacing/sizing
 * utilities already emit.
 */
export function spaceYUtilityClass(varName: string, sizeKey: string): [string, string] {
  return [`.ui-space-y-${sizeKey} ${CHILD_COMBINATOR}`, `margin-top: var(--${varName});`];
}

/** Static, non-token-driven divide-y utility class, emitted once per build. */
export const STATIC_DIVIDE_CLASSES: ReadonlyMap<string, string> = new Map([
  [
    `.ui-divide-y ${CHILD_COMBINATOR}`,
    'border-top-width: 1px;\nborder-color: var(--ui-border-on-surface-divider);',
  ],
]);
