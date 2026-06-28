import { describe, expect, it } from 'vitest';

import { getRule } from '../grammar';
import { formatReport, runKitLint } from '../scripts/kit-lint';

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
