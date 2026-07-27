// Framework-agnostic spacing utility classes, generated from the `spacing.*`
// semantic tokens for consumers who don't extend the Tailwind preset (see
// context/output.md). Mirrors the `{property}{direction}-{size}` grammar
// Tailwind's own engine derives for free once a preset key exists.

const PADDING_DIRECTIONS: Record<string, string> = {
  p: 'padding',
  px: 'padding-inline',
  py: 'padding-block',
  pt: 'padding-top',
  pb: 'padding-bottom',
  pl: 'padding-left',
  pr: 'padding-right',
  ps: 'padding-inline-start',
  pe: 'padding-inline-end',
};

const MARGIN_DIRECTIONS: Record<string, string> = {
  m: 'margin',
  mx: 'margin-inline',
  my: 'margin-block',
  mt: 'margin-top',
  mb: 'margin-bottom',
  ml: 'margin-left',
  mr: 'margin-right',
  ms: 'margin-inline-start',
  me: 'margin-inline-end',
};

const GAP_DIRECTIONS: Record<string, string> = {
  gap: 'gap',
  'gap-x': 'column-gap',
  'gap-y': 'row-gap',
};

/**
 * Selector→block entries for one resolved spacing token: the full padding,
 * margin, and gap grammar at that size, all referencing the same custom
 * property so a brand override (were spacing ever to gain one) only needs to
 * change the variable, not every class.
 */
export function spacingUtilityClasses(varName: string, sizeKey: string): Map<string, string> {
  const classes = new Map<string, string>();
  const value = `var(--${varName})`;

  for (const [prefix, property] of Object.entries({
    ...PADDING_DIRECTIONS,
    ...MARGIN_DIRECTIONS,
    ...GAP_DIRECTIONS,
  })) {
    classes.set(`.ui-${prefix}-${sizeKey}`, `${property}: ${value};`);
  }

  return classes;
}

/** Static, non-token-driven utility emitted once per build (not per size). */
export const STATIC_SPACING_CLASSES: ReadonlyMap<string, string> = new Map([
  ['.ui-mx-auto', 'margin-inline: auto;'],
]);
