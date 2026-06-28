import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  getLedgerEntry,
  ledger,
  ledgerByStatus,
  validateLedger,
} from '../grammar';
import type { LedgerEntry } from '../grammar';

const HERE = dirname(fileURLToPath(import.meta.url));
const LEDGER_MD = readFileSync(resolve(HERE, '../grammar/LEDGER.md'), 'utf8');

const valid: LedgerEntry = {
  id: 'sample',
  title: 'A sample discrepancy',
  checklist: 'C2',
  rule: 'composition/edge-baseline-alignment',
  severity: 'should',
  source: { screen: 'x', ref: 'header' },
  discovered: '2026-06-28',
  status: 'resolved',
  resolution: { kind: 'detector', detector: 'screen/alignment-grid' },
};

describe('the shipped ledger', () => {
  it('validates clean', () => {
    expect(validateLedger()).toEqual([]);
  });

  it('has entries with unique ids', () => {
    expect(ledger.length).toBeGreaterThan(0);
    expect(new Set(ledger.map((e) => e.id)).size).toBe(ledger.length);
  });

  it('lookups work', () => {
    expect(getLedgerEntry('scroll-area-hover-active-token')?.status).toBe('open');
    expect(getLedgerEntry('nope')).toBeUndefined();
    expect(ledgerByStatus('resolved').every((e) => e.status === 'resolved')).toBe(true);
  });
});

describe('LEDGER.md mirrors the registry 1:1', () => {
  const mdIds = new Set(
    LEDGER_MD.split('\n')
      .map((line) => /^\|\s*([a-z][a-z0-9-]+)\s*\|/.exec(line)?.[1])
      .filter((id): id is string => Boolean(id))
  );
  const regIds = new Set(ledger.map((e) => e.id));

  it('every registry entry has a LEDGER.md row', () => {
    const missing = [...regIds].filter((id) => !mdIds.has(id));
    expect(missing, `entries without a row: ${missing.join(', ')}`).toEqual([]);
  });

  it('every LEDGER.md row has a registry entry', () => {
    const missing = [...mdIds].filter((id) => !regIds.has(id));
    expect(missing, `rows without an entry: ${missing.join(', ')}`).toEqual([]);
  });
});

describe('validateLedger', () => {
  it('accepts a well-formed entry', () => {
    expect(validateLedger([valid])).toEqual([]);
  });

  it('flags an unknown rule / mismatched checklist row', () => {
    expect(validateLedger([{ ...valid, rule: 'no/such-rule' }]).join(' ')).toMatch(/unknown rule/);
    expect(
      validateLedger([{ ...valid, checklist: 'C8' }]).join(' ')
    ).toMatch(/disagrees with checklist/);
  });

  it('requires a resolution once resolved/accepted', () => {
    const { resolution, ...noRes } = valid;
    void resolution;
    expect(validateLedger([noRes]).join(' ')).toMatch(/has no resolution/);
  });

  it('checks the resolution target exists', () => {
    expect(
      validateLedger([
        { ...valid, resolution: { kind: 'detector', detector: 'screen/not-real' } },
      ]).join(' ')
    ).toMatch(/not a declared rule detector/);
    expect(
      validateLedger([
        { ...valid, resolution: { kind: 'new-rule', rule: 'no/such-rule' } },
      ]).join(' ')
    ).toMatch(/does not exist/);
  });

  it('an accepted entry must point at a real override', () => {
    const errs = validateLedger([
      { ...valid, status: 'accepted', resolution: { kind: 'override', override: 'ghost' } },
    ]);
    expect(errs.join(' ')).toMatch(/override "ghost" does not exist/);
  });

  it('flags an invalid status / discovered date / empty source', () => {
    expect(
      validateLedger([{ ...valid, status: 'wat' as LedgerEntry['status'] }]).join(' ')
    ).toMatch(/invalid status/);
    expect(validateLedger([{ ...valid, discovered: 'nope' }]).join(' ')).toMatch(/invalid discovered/);
    expect(validateLedger([{ ...valid, source: {} }]).join(' ')).toMatch(/no source/);
  });
});
