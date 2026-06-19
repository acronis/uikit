// Executor coverage: lossless scale, the stroke-width formula, and the mono vs
// preserve color modes, run against real source SVGs from the package.

import { describe, expect, it } from 'vitest';

import { executeSvg } from '../executor';
import { loadAllRules, readSvg, resolveBinary } from '../read';

const rules = loadAllRules();
const scale16 = rules.get('scale-16')!;
const stroke16 = rules.get('stroke-1-6')!;
const scale96 = rules.get('scale-96')!;

const src = (rel: string): string => readSvg(resolveBinary(rel).absPath);
const BAN = './packs/icons-stroke-mono/CircleBan.svg';
const DOT = './packs/icons-stroke-multi/DotBlue.svg';
const ILLU = './packs/illustrations/0001-full-image-backup-48.svg';

describe('executor', () => {
  it('scale is lossless: sets width/height, preserves the viewBox + geometry', () => {
    const out = executeSvg(src(BAN), [scale16], 'mono');
    expect(out).toContain('viewBox="0 0 24 24"');
    expect(out).toMatch(/width="16"/);
    expect(out).toMatch(/height="16"/);
  });

  it('stroke sizes to target px in the scaled coordinate space (1.6 * 24 / 16 = 2.4)', () => {
    const out = executeSvg(src(BAN), [scale16, stroke16], 'mono');
    expect(out).toContain('stroke-width="2.4"');
  });

  it('mono rewrites every hardcoded color to currentColor', () => {
    const out = executeSvg(src(BAN), [], 'mono');
    expect(out).toContain('currentColor');
    expect(out).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
  });

  it('preserve keeps exact multi-colors and never injects currentColor', () => {
    const out = executeSvg(src(DOT), [], 'preserve').toLowerCase();
    expect(out).toContain('#1763cf');
    expect(out).toContain('#1354ae');
    expect(out).not.toContain('currentcolor');
  });

  it('preserve keeps illustration gradients, referenced ids, and the viewBox', () => {
    const out = executeSvg(src(ILLU), [scale96], 'preserve');
    expect(out).toContain('viewBox="0 0 48 48"');
    expect(out).toMatch(/width="96"/);
    expect(out).toMatch(/url\(#/);
    expect(out).toContain('linearGradient');
  });
});
