// Discrepancy ledger — registry + validation. Human mirror: ../LEDGER.md.
//
// Seeded with the real findings that motivated this whole system (the App Shell
// review cited in the proposal, plus the hover→active token mis-wiring the new
// kit-lint T4 detector surfaced). Each carries how the loop closed it. See
// ./types.ts and context/kit-consistency-audit-proposal.md §9.
import { allRules, getRule } from '../rules';
import { overrides } from '../overrides';
import type { LedgerEntry } from './types';

export type {
  LedgerEntry,
  LedgerStatus,
  LedgerResolution,
  LedgerSource,
  ResolutionKind,
} from './types';

const STATUSES = ['open', 'resolved', 'accepted'] as const;
const KINDS = ['detector', 'new-rule', 'override'] as const;
const SEVERITIES = ['must', 'should', 'may'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const ledger: LedgerEntry[] = [
  {
    id: 'app-shell-search-offcenter',
    title:
      'App Shell header search is left-aligned / off the header center axis',
    checklist: 'C2',
    rule: 'composition/edge-baseline-alignment',
    severity: 'should',
    source: { screen: 'protection-dashboard', ref: 'header' },
    discovered: '2026-06-28',
    status: 'resolved',
    resolution: {
      kind: 'detector',
      detector: 'screen/alignment-grid',
      note: 'Found by eyeballing the assembled screen; now caught structurally by the alignment-grid detector (near-miss edges) so it cannot silently recur.',
      date: '2026-06-28',
    },
  },
  {
    id: 'app-shell-collapsed-rail-crops-row',
    title:
      'Collapsed sidebar rail reserved a scrollbar gutter that cropped the selected row',
    checklist: 'C8',
    rule: 'composition/no-clipping',
    severity: 'should',
    source: { screen: 'protection-dashboard', ref: 'sidebar' },
    discovered: '2026-06-28',
    status: 'resolved',
    resolution: {
      kind: 'detector',
      detector: 'screen/reserved-gutter',
      note: 'Fixed by the ScrollArea overlay scrollbar (PR #479, zero reserved gutter); the reserved-gutter detector guards against regression.',
      date: '2026-06-28',
    },
  },
  {
    id: 'scroll-area-hover-active-token',
    title:
      'ScrollArea wires a hover: state to an -active border token instead of a -hover one',
    checklist: 'T4',
    rule: 'tokens/state-token-wiring',
    severity: 'should',
    source: {
      component: 'scroll-area',
      file: 'packages/ui-react/src/components/ui/scroll-area/scroll-area.tsx',
    },
    discovered: '2026-06-28',
    status: 'open',
    resolution: {
      kind: 'detector',
      detector: 'kit-lint/state-token-wiring',
      note: 'The new T4 detector surfaces it as a should-warning. Awaiting a dedicated -hover border token, a code fix, or an approved override — the loop working as intended.',
    },
  },
];

const declaredDetectors = new Set(allRules.map((r) => r.detector));

/**
 * Validate ledger entries: unique id, resolvable rule/checklist, valid severity/
 * status/dates, a non-empty source, and a consistent resolution whose target
 * exists (a declared detector, a real rule, or an existing override). Returns
 * human-readable errors (empty = valid).
 */
export function validateLedger(list: LedgerEntry[] = ledger): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const checklistRows = new Set(allRules.map((r) => r.checklist));

  for (const e of list) {
    const label = e.id ? `ledger "${e.id}"` : 'ledger entry (missing id)';
    if (!e.id) errors.push('a ledger entry is missing an id');
    else if (ids.has(e.id)) errors.push(`duplicate ledger id "${e.id}"`);
    if (e.id) ids.add(e.id);
    if (!e.title?.trim()) errors.push(`${label} is missing a title`);
    if (!SEVERITIES.includes(e.severity))
      errors.push(`${label} has an invalid severity "${e.severity}"`);
    if (!STATUSES.includes(e.status))
      errors.push(`${label} has an invalid status "${e.status}"`);
    if (!DATE_RE.test(e.discovered ?? ''))
      errors.push(`${label} has an invalid discovered date "${e.discovered}"`);
    if (!e.source || Object.keys(e.source).length === 0)
      errors.push(`${label} has no source (needs at least one selector)`);
    if (e.checklist && !checklistRows.has(e.checklist))
      errors.push(`${label} references unknown checklist row "${e.checklist}"`);
    if (e.rule) {
      const rule = getRule(e.rule);
      if (!rule) errors.push(`${label} references unknown rule "${e.rule}"`);
      else if (e.checklist && rule.checklist !== e.checklist)
        errors.push(
          `${label} rule "${e.rule}" (row ${rule.checklist}) disagrees with checklist "${e.checklist}"`
        );
    }

    const r = e.resolution;
    if (e.status === 'open') {
      if (r && !KINDS.includes(r.kind))
        errors.push(`${label} has an invalid resolution kind "${r.kind}"`);
    } else {
      if (!r) {
        errors.push(`${label} is "${e.status}" but has no resolution`);
        continue;
      }
      if (!KINDS.includes(r.kind))
        errors.push(`${label} has an invalid resolution kind "${r.kind}"`);
      if (r.date && !DATE_RE.test(r.date))
        errors.push(`${label} has an invalid resolution date "${r.date}"`);
      if (e.status === 'accepted' && r.kind !== 'override')
        errors.push(`${label} is "accepted" but its resolution is not an override`);
      if (r.kind === 'detector' && !declaredDetectors.has(r.detector ?? ''))
        errors.push(`${label} resolution detector "${r.detector}" is not a declared rule detector`);
      if (r.kind === 'new-rule' && !getRule(r.rule ?? ''))
        errors.push(`${label} resolution rule "${r.rule}" does not exist`);
      if (r.kind === 'override' && !overrides.some((o) => o.id === r.override))
        errors.push(`${label} resolution override "${r.override}" does not exist`);
    }
  }
  return errors;
}

export function getLedgerEntry(id: string): LedgerEntry | undefined {
  return ledger.find((e) => e.id === id);
}

export function ledgerByStatus(status: LedgerEntry['status']): LedgerEntry[] {
  return ledger.filter((e) => e.status === status);
}
