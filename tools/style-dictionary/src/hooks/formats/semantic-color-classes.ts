// Framework-agnostic semantic color utility classes — one class per existing
// `--ui-text-*`/`--ui-background-*`/`--ui-border-*` custom property,
// mechanically wrapped (PLTFRM-94106: "don't pick winning roles from the
// audit; generate one class per token that already exists in tokens-pd —
// the token layer is already the complete, versioned source of truth").
//
// Full path, no truncation: `--ui-text-on-surface-link-idle` becomes
// `.ui-text-on-surface-link-idle`, not a hand-picked alias like
// `ui-text-brand` — same "mirror the name verbatim" convention already used
// by every other utility in this grammar (`ui-top-16`, `ui-border-t-4`, …).
// `background` shortens to `bg` in the class prefix only (matching Tailwind's
// own convention) — the token's own path/suffix is never touched.
//
// Driven entirely by whatever color vars the semantics tier resolves to at
// build time, not a hardcoded list — a new `colors.text/background/border.*`
// token in `@acronis-platform/design-tokens` gets a class for free on the
// next build, no generator change.

const COLOR_ROOTS: Record<string, { classPrefix: string; property: string }> = {
  text: { classPrefix: 'text', property: 'color' },
  background: { classPrefix: 'bg', property: 'background-color' },
  border: { classPrefix: 'border', property: 'border-color' },
};

/**
 * Selector→block entries for every `--ui-{text,background,border}-*` var
 * present in the given map (a brand's resolved semantic vars) — brand-
 * invariant, since the class body only references the variable name, never
 * a resolved value.
 */
export function semanticColorClasses(vars: ReadonlyMap<string, string>): Map<string, string> {
  const classes = new Map<string, string>();

  for (const varName of vars.keys()) {
    for (const [root, { classPrefix, property }] of Object.entries(COLOR_ROOTS)) {
      const prefix = `ui-${root}-`;
      if (!varName.startsWith(prefix)) continue;
      const role = varName.slice(prefix.length);
      classes.set(`.ui-${classPrefix}-${role}`, `${property}: var(--${varName});`);
    }
  }

  return classes;
}
