import { describe, expect, it } from 'vitest';

import { getRule } from '../grammar';
import { formatReport, lintSource, runKitLint } from '../scripts/kit-lint';

const findings = runKitLint();

describe('kit-lint static detectors', () => {
  it('produces no `must`-level findings (these block CI)', () => {
    const must = findings.filter((f) => f.severity === 'must');
    expect(must, formatReport(must)).toEqual([]);
  });

  it('every finding maps to a real grammar rule', () => {
    for (const f of findings) {
      const rule = getRule(f.ruleId);
      expect(rule, `unknown rule ${f.ruleId}`).toBeTruthy();
      expect(f.severity).toBe(rule?.severity);
      expect(f.checklist).toBe(rule?.checklist);
    }
  });
});

// Focused detector tests over synthetic source (no dependence on shipped code).
const ruleIds = (src: string): string[] =>
  lintSource('x.tsx', src).map((f) => f.ruleId);

describe('T4 tokens/state-token-wiring', () => {
  it('flags a state variant wired to a base token', () => {
    expect(ruleIds('className="hover:bg-[var(--ui-x-idle)]"')).toContain(
      'tokens/state-token-wiring'
    );
  });
  it('flags a state variant wired to a different state token', () => {
    expect(ruleIds('className="hover:border-[var(--ui-x-active)]"')).toContain(
      'tokens/state-token-wiring'
    );
  });
  it('accepts a matching state token', () => {
    expect(ruleIds('className="hover:bg-[var(--ui-x-hover)]"')).not.toContain(
      'tokens/state-token-wiring'
    );
  });
  it('ignores a state variant on a semantic token with no state suffix', () => {
    expect(
      ruleIds('className="hover:text-[var(--ui-text-on-surface-primary)]"')
    ).not.toContain('tokens/state-token-wiring');
  });
});

describe('Y1/Y2/Y3 typography', () => {
  it('flags off-scale font size', () => {
    expect(ruleIds('className="text-[13px]"')).toContain('typography/type-scale');
  });
  it('flags off-ramp line-height', () => {
    expect(ruleIds('className="leading-[1.15]"')).toContain('typography/line-height');
  });
  it('flags arbitrary numeric font-weight', () => {
    expect(ruleIds('className="font-[550]"')).toContain('typography/font-weight');
  });
  it('accepts token/utility typography', () => {
    const out = ruleIds('className="text-sm leading-6 font-medium"');
    expect(out).not.toContain('typography/type-scale');
    expect(out).not.toContain('typography/line-height');
    expect(out).not.toContain('typography/font-weight');
  });
});

describe('I3 interaction/timing-parity', () => {
  it('flags an arbitrary transition duration', () => {
    expect(ruleIds('className="duration-[120ms]"')).toContain(
      'interaction/timing-parity'
    );
  });
  it('accepts a duration scale step', () => {
    expect(ruleIds('className="duration-200"')).not.toContain(
      'interaction/timing-parity'
    );
  });
});

describe('overrides wiring', () => {
  it('runKitLint suppresses a finding a scoped override covers', () => {
    const ruleId = 'tokens/state-token-wiring';
    const covered = (f: { ruleId: string; file: string }) =>
      f.ruleId === ruleId && f.file.includes('scroll-area');
    const active = runKitLint({
      overrides: [
        {
          id: 'sa-state',
          rule: ruleId,
          scope: { component: 'scroll-area' },
          reason: 'no -hover token exists for this border tier yet',
          approvedBy: 'tester',
          date: '2026-06-28',
        },
      ],
    });
    expect(active.some(covered)).toBe(false);
  });
});
