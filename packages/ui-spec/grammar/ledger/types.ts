// Discrepancy ledger — the record that makes the kit ratchet.
//
// Every real audit finding is logged here with how it was resolved. The rule
// (proposal §9): a finding is not "done" when the pixel is fixed — it's done when
// a permanent check exists so it can never recur. So each entry resolves into one
// of three kinds: an existing/new **detector** guards it, a **new rule** is
// ratified for it, or it's an intentional deviation **accepted** via an override.
// AI may propose entries + rules; a human owns the `must` tier.
import type { RuleSeverity } from '../types';

export type LedgerStatus = 'open' | 'resolved' | 'accepted';

/** How a finding was put to rest. */
export type ResolutionKind = 'detector' | 'new-rule' | 'override';

export interface LedgerResolution {
  kind: ResolutionKind;
  /** kind=detector — the detector id that now guards this (a declared rule detector). */
  detector?: string;
  /** kind=new-rule — the grammar rule id created for it. */
  rule?: string;
  /** kind=override / accepted — the override id that waives it. */
  override?: string;
  note?: string;
  /** ISO date resolved (YYYY-MM-DD). */
  date?: string;
}

/** Where the discrepancy was found. At least one selector is required. */
export interface LedgerSource {
  screen?: string;
  component?: string;
  file?: string;
  ref?: string;
}

export interface LedgerEntry {
  /** Unique kebab slug. */
  id: string;
  /** One-line description of the discrepancy. */
  title: string;
  /** Checklist row id it maps to (e.g. `C2`), if catalogued. */
  checklist?: string;
  /** Grammar rule id it maps to, if any. */
  rule?: string;
  severity: RuleSeverity;
  source: LedgerSource;
  /** ISO date discovered / logged (YYYY-MM-DD). */
  discovered: string;
  status: LedgerStatus;
  /** Required once `status` is `resolved` or `accepted`. */
  resolution?: LedgerResolution;
}
