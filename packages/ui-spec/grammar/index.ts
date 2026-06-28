// Kit grammar — the machine-readable cross-component rule registry.
// Human mirror: ./CHECKLIST.md. Design: context/kit-consistency-audit-proposal.md.
export type { KitRule, RuleCategory, RuleSeverity } from './types';
export {
  allRules,
  getRule,
  getRulesByCategory,
  getMandatoryRules,
} from './rules';
