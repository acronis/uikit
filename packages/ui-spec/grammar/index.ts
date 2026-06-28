// Kit grammar — the machine-readable cross-component rule registry.
// Human mirror: ./CHECKLIST.md. Design: context/kit-consistency-audit-proposal.md.
export type { KitRule, RuleCategory, RuleSeverity } from './types';
export {
  allRules,
  getRule,
  getRulesByCategory,
  getMandatoryRules,
} from './rules';
export type { KitOverride, OverrideScope, OverrideTarget } from './overrides';
export {
  overrides,
  validateOverrides,
  matchesOverride,
  isOverridden,
  applyOverrides,
} from './overrides';
export type {
  LedgerEntry,
  LedgerStatus,
  LedgerResolution,
  LedgerSource,
  ResolutionKind,
} from './ledger';
export {
  ledger,
  validateLedger,
  getLedgerEntry,
  ledgerByStatus,
} from './ledger';
