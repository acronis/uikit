// Kit grammar — machine-readable cross-component rules.
//
// A KitRule is a single cross-component invariant ("the same thing is always the
// same across components"): one focus-ring treatment, one token per semantic
// role, one control height per row, etc. Rules are the queryable ground truth
// that the static lint, the rendered-screen audit, and the AI reviewer all read,
// so an invariant is defined exactly once. See ./CHECKLIST.md (human mirror) and
// context/kit-consistency-audit-proposal.md.

export type RuleCategory =
  | 'tokens'
  | 'spacing'
  | 'typography'
  | 'anatomy'
  | 'interaction'
  | 'accessibility'
  | 'composition'
  | 'cross-impl';

/** must = blocks CI; should = warns; may = guidance. Only a human may set `must`. */
export type RuleSeverity = 'must' | 'should' | 'may';

export interface KitRule {
  /** `<category>/<kebab-case>`, e.g. `tokens/no-hardcoded-color`. Unique. */
  id: string;
  title: string;
  category: RuleCategory;
  severity: RuleSeverity;
  /** Imperative, 1–2 sentences: what must hold. */
  rule: string;
  /** Why it exists. */
  rationale: string;
  /** Back-link to the CHECKLIST.md row id (e.g. `T1`, `Z2`). Unique. */
  checklist: string;
  /**
   * Id of the automated check that enforces this rule, or `human` when it can
   * only be judged in review. Detectors are built in later phases; for now this
   * documents *how* the rule is intended to be enforced.
   */
  detector: string;
  /** `--ui-*` tokens this rule governs, if any. */
  tokens?: string[];
  /** WCAG success criteria, if applicable (e.g. `1.4.3`). */
  wcag?: string[];
  /** Other rule ids related to this one. */
  relatedRules?: string[];
}
