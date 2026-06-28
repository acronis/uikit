import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  allRules,
  getMandatoryRules,
  getRule,
  getRulesByCategory,
  type RuleCategory,
} from '../grammar';

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKLIST = readFileSync(resolve(HERE, '../grammar/CHECKLIST.md'), 'utf8');

const CATEGORIES: RuleCategory[] = [
  'tokens',
  'spacing',
  'typography',
  'anatomy',
  'interaction',
  'accessibility',
  'composition',
  'cross-impl',
];
const SEVERITIES = ['must', 'should', 'may'];
const ID_RE = /^[a-z][a-z-]*\/[a-z0-9-]+$/;

describe('grammar rule registry integrity', () => {
  it('has rules', () => {
    expect(allRules.length).toBeGreaterThan(0);
  });

  it('rule ids are unique', () => {
    const ids = allRules.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('checklist row ids are unique', () => {
    const rows = allRules.map((r) => r.checklist);
    expect(new Set(rows).size).toBe(rows.length);
  });

  for (const rule of allRules) {
    describe(rule.id, () => {
      it('id is <category>/<kebab> and the prefix matches category', () => {
        expect(rule.id, `${rule.id} bad id format`).toMatch(ID_RE);
        expect(rule.id.split('/')[0]).toBe(rule.category);
      });

      it('has a valid category and severity', () => {
        expect(CATEGORIES).toContain(rule.category);
        expect(SEVERITIES).toContain(rule.severity);
      });

      it('has non-empty required fields', () => {
        for (const field of ['title', 'rule', 'rationale', 'checklist', 'detector'] as const) {
          expect(rule[field], `${rule.id}.${field} is empty`).toBeTruthy();
        }
      });

      it('relatedRules resolve to existing rules', () => {
        for (const id of rule.relatedRules ?? []) {
          expect(getRule(id), `${rule.id} → unknown relatedRule "${id}"`).toBeTruthy();
        }
      });
    });
  }
});

describe('CHECKLIST.md mirrors the registry 1:1', () => {
  const checklistRowIds = new Set(
    CHECKLIST.split('\n')
      .map((line) => /^\|\s*([A-Z]\d+)\s*\|/.exec(line)?.[1])
      .filter((id): id is string => Boolean(id))
  );
  const ruleRowIds = new Set(allRules.map((r) => r.checklist));

  it('every rule has a CHECKLIST.md row', () => {
    const missing = [...ruleRowIds].filter((id) => !checklistRowIds.has(id));
    expect(missing, `rules without a checklist row: ${missing.join(', ')}`).toEqual([]);
  });

  it('every CHECKLIST.md row has a rule', () => {
    const missing = [...checklistRowIds].filter((id) => !ruleRowIds.has(id));
    expect(missing, `checklist rows without a rule: ${missing.join(', ')}`).toEqual([]);
  });
});

describe('lookups', () => {
  it('getRule finds by id', () => {
    expect(getRule('tokens/no-hardcoded-color')?.severity).toBe('must');
    expect(getRule('does/not-exist')).toBeUndefined();
  });

  it('getRulesByCategory filters', () => {
    for (const c of CATEGORIES) {
      expect(getRulesByCategory(c).every((r) => r.category === c)).toBe(true);
    }
  });

  it('getMandatoryRules returns only must', () => {
    expect(getMandatoryRules().every((r) => r.severity === 'must')).toBe(true);
    expect(getMandatoryRules().length).toBeGreaterThan(0);
  });
});
