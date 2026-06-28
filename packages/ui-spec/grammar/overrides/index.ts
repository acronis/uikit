// Grammar overrides — registry + validation + matching/suppression.
//
// The registry starts empty: there are no approved deviations yet. When a real
// one is needed (e.g. an intentionally compact device table), a human adds a
// typed entry here; the audits (kit-lint, screen-audit) then treat the matching
// finding as a pass instead of a defect. See ./types.ts and README.md.
import { getRule } from '../rules';
import type { KitOverride, OverrideTarget } from './types';

export type { KitOverride, OverrideScope, OverrideTarget } from './types';

/** Approved deviations. Empty until a human ratifies one. */
export const overrides: KitOverride[] = [];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const toKebab = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Validate override entries: unique id, resolvable rule, non-empty scope/reason/
 * approver, and well-formed dates. Returns a list of human-readable errors
 * (empty = valid). `ruleExists` is injectable for tests.
 */
export function validateOverrides(
  list: KitOverride[] = overrides,
  ruleExists: (id: string) => boolean = (id) => Boolean(getRule(id))
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const o of list) {
    const label = o.id ? `override "${o.id}"` : 'override (missing id)';
    if (!o.id) errors.push('an override is missing an id');
    else if (ids.has(o.id)) errors.push(`duplicate override id "${o.id}"`);
    if (o.id) ids.add(o.id);
    if (!ruleExists(o.rule)) errors.push(`${label} references unknown rule "${o.rule}"`);
    if (!o.scope || Object.keys(o.scope).length === 0)
      errors.push(`${label} has no scope (needs at least one selector)`);
    if (!o.reason?.trim()) errors.push(`${label} is missing a reason`);
    if (!o.approvedBy?.trim()) errors.push(`${label} is missing approvedBy`);
    if (!DATE_RE.test(o.date ?? '')) errors.push(`${label} has an invalid date "${o.date}"`);
    if (o.expires && !DATE_RE.test(o.expires))
      errors.push(`${label} has an invalid expires "${o.expires}"`);
  }
  return errors;
}

/**
 * Does this override apply to the target finding? Requires the same rule, every
 * specified scope selector to match, and (if `today` is given) a non-expired
 * override. An override with an empty scope never matches.
 */
export function matchesOverride(
  o: KitOverride,
  t: OverrideTarget,
  today?: string
): boolean {
  if (o.rule !== t.ruleId) return false;
  if (!o.scope || Object.keys(o.scope).length === 0) return false;
  if (today && o.expires && o.expires < today) return false;
  const s = o.scope;
  if (s.component && (!t.component || toKebab(s.component) !== toKebab(t.component)))
    return false;
  if (s.screen && s.screen !== t.screen) return false;
  if (s.region && s.region !== t.region) return false;
  if (s.file && !(t.file && t.file.includes(s.file))) return false;
  if (s.ref && s.ref !== t.ref) return false;
  return true;
}

export function isOverridden(
  t: OverrideTarget,
  opts: { overrides?: KitOverride[]; today?: string } = {}
): boolean {
  const list = opts.overrides ?? overrides;
  return list.some((o) => matchesOverride(o, t, opts.today));
}

/**
 * Split findings into those still active and those suppressed by an override.
 * `toTarget` maps a finding to its location. Generic over the finding shape so
 * both kit-lint and screen-audit reuse it.
 */
export function applyOverrides<T>(
  findings: T[],
  toTarget: (f: T) => OverrideTarget,
  opts: { overrides?: KitOverride[]; today?: string } = {}
): { active: T[]; suppressed: T[] } {
  const list = opts.overrides ?? overrides;
  const active: T[] = [];
  const suppressed: T[] = [];
  for (const f of findings) {
    if (list.some((o) => matchesOverride(o, toTarget(f), opts.today)))
      suppressed.push(f);
    else active.push(f);
  }
  return { active, suppressed };
}
