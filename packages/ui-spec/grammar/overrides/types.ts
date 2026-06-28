// Grammar overrides — approved, scoped, dated deviations from a grammar rule.
//
// An override is how an *intentional* deviation stays legal: instead of a defect,
// the audit treats a matching finding as a pass. Every override names the rule it
// waives, a scope (where it applies), a human-readable reason, who approved it,
// and the date — so a waiver is auditable and never silent. A person owns this:
// only a human adds an override entry. See context/kit-consistency-audit-proposal.md §5/§9.

/** Where an override applies. At least one selector is required (validated). */
export interface OverrideScope {
  /** ui-react component (dir or PascalCase name; matched case-insensitively kebab). */
  component?: string;
  /** Screen slug (screens/<slug>). */
  screen?: string;
  /** Region id within a screen. */
  region?: string;
  /** Repo-relative path or path fragment (substring match) — for kit-lint findings. */
  file?: string;
  /** Node locator (exact) — for screen-audit findings. */
  ref?: string;
}

export interface KitOverride {
  /** Unique kebab slug. */
  id: string;
  /** Grammar rule id this waives (must resolve in the registry). */
  rule: string;
  scope: OverrideScope;
  /** Why this deviation is intentional. */
  reason: string;
  /** The human who approved it (a person owns waivers). */
  approvedBy: string;
  /** ISO date approved (YYYY-MM-DD). */
  date: string;
  /** Optional ISO expiry (YYYY-MM-DD); after this the override no longer applies. */
  expires?: string;
}

/** A finding's location, normalized so an override can be matched against it. */
export interface OverrideTarget {
  ruleId: string;
  component?: string;
  screen?: string;
  region?: string;
  file?: string;
  ref?: string;
}
