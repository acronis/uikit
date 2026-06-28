import { describe, expect, it } from 'vitest';

import {
  applyOverrides,
  isOverridden,
  matchesOverride,
  overrides,
  validateOverrides,
} from '../grammar/overrides';
import type { KitOverride } from '../grammar/overrides';

const base: KitOverride = {
  id: 'compact-device-table',
  rule: 'spacing/control-height-parity',
  scope: { screen: 'devices', region: 'table' },
  reason: 'The device table is intentionally compact per design.',
  approvedBy: 'Leonid Romanov',
  date: '2026-06-28',
};

describe('the shipped override registry', () => {
  it('is empty until a human ratifies a deviation', () => {
    expect(overrides).toEqual([]);
  });

  it('validates clean (no entries, no errors)', () => {
    expect(validateOverrides()).toEqual([]);
  });
});

describe('validateOverrides', () => {
  it('accepts a well-formed entry', () => {
    expect(validateOverrides([base])).toEqual([]);
  });

  it('flags an unknown rule', () => {
    const errs = validateOverrides([{ ...base, rule: 'nope/not-a-rule' }]);
    expect(errs.join(' ')).toMatch(/unknown rule/);
  });

  it('flags an empty scope, missing reason/approver, and bad dates', () => {
    const errs = validateOverrides([
      { ...base, scope: {} },
      { ...base, id: 'b', reason: '' },
      { ...base, id: 'c', approvedBy: '' },
      { ...base, id: 'd', date: '2026/06/28' },
      { ...base, id: 'e', expires: 'soon' },
    ]);
    expect(errs.join(' ')).toMatch(/no scope/);
    expect(errs.join(' ')).toMatch(/missing a reason/);
    expect(errs.join(' ')).toMatch(/missing approvedBy/);
    expect(errs.join(' ')).toMatch(/invalid date/);
    expect(errs.join(' ')).toMatch(/invalid expires/);
  });

  it('flags duplicate ids', () => {
    const errs = validateOverrides([base, { ...base }]);
    expect(errs.join(' ')).toMatch(/duplicate override id/);
  });
});

describe('matchesOverride', () => {
  it('matches the same rule + all specified scope selectors', () => {
    expect(
      matchesOverride(base, {
        ruleId: 'spacing/control-height-parity',
        screen: 'devices',
        region: 'table',
      })
    ).toBe(true);
  });

  it('does not match a different rule', () => {
    expect(
      matchesOverride(base, { ruleId: 'accessibility/contrast', screen: 'devices', region: 'table' })
    ).toBe(false);
  });

  it('does not match when a scope selector differs', () => {
    expect(
      matchesOverride(base, { ruleId: 'spacing/control-height-parity', screen: 'devices', region: 'header' })
    ).toBe(false);
  });

  it('matches a component scope case/style-insensitively', () => {
    const o: KitOverride = { ...base, scope: { component: 'ScrollArea' } };
    expect(matchesOverride(o, { ruleId: base.rule, component: 'scroll-area' })).toBe(true);
  });

  it('matches a file fragment for kit-lint findings', () => {
    const o: KitOverride = { ...base, scope: { file: 'scroll-area/scroll-area.tsx' } };
    expect(
      matchesOverride(o, {
        ruleId: base.rule,
        file: 'packages/ui-react/src/components/ui/scroll-area/scroll-area.tsx',
      })
    ).toBe(true);
  });

  it('never matches an empty scope', () => {
    expect(matchesOverride({ ...base, scope: {} }, { ruleId: base.rule })).toBe(false);
  });

  it('does not suppress once expired', () => {
    const o: KitOverride = { ...base, expires: '2026-01-01' };
    const t = { ruleId: base.rule, screen: 'devices', region: 'table' };
    expect(matchesOverride(o, t, '2025-12-31')).toBe(true); // before expiry
    expect(matchesOverride(o, t, '2026-06-28')).toBe(false); // after expiry
  });
});

describe('applyOverrides / isOverridden', () => {
  type F = { ruleId: string; screen: string; region: string };
  const findings: F[] = [
    { ruleId: 'spacing/control-height-parity', screen: 'devices', region: 'table' },
    { ruleId: 'spacing/control-height-parity', screen: 'devices', region: 'header' },
  ];

  it('splits suppressed from active', () => {
    const { active, suppressed } = applyOverrides(
      findings,
      (f) => ({ ruleId: f.ruleId, screen: f.screen, region: f.region }),
      { overrides: [base] }
    );
    expect(suppressed).toHaveLength(1);
    expect(suppressed[0].region).toBe('table');
    expect(active).toHaveLength(1);
    expect(active[0].region).toBe('header');
  });

  it('isOverridden honors an injected registry', () => {
    expect(
      isOverridden(
        { ruleId: base.rule, screen: 'devices', region: 'table' },
        { overrides: [base] }
      )
    ).toBe(true);
    expect(
      isOverridden({ ruleId: base.rule, screen: 'devices', region: 'table' })
    ).toBe(false); // real (empty) registry
  });
});
