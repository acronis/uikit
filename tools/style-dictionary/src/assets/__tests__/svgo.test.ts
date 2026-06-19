// SVGO config guards: the conservative overrides that downstream consumers depend
// on. If a future SVGO default change reintroduces id mangling or viewBox removal,
// these fail loudly.

import { describe, expect, it } from 'vitest';

import { executeSvg } from '../executor';
import { readSvg, resolveBinary } from '../read';

const src = (rel: string): string => readSvg(resolveBinary(rel).absPath);
const ILLU = './packs/illustrations/0001-full-image-backup-48.svg';
const DOT = './packs/icons-stroke-multi/DotBlue.svg';

describe('svgo config', () => {
  it('keeps the viewBox (removeViewBox stays off in v4)', () => {
    expect(executeSvg(src(ILLU), [], 'preserve')).toContain('viewBox=');
  });

  it('keeps referenced ids verbatim (cleanupIds off)', () => {
    const s = src(ILLU);
    const id = s.match(/id="([^"]*linear[^"]*)"/)?.[1];
    expect(id).toBeTruthy();
    expect(executeSvg(s, [], 'preserve')).toContain(id!);
  });

  it('keeps independently-filled shapes distinct (mergePaths off for preserve)', () => {
    const out = executeSvg(src(DOT), [], 'preserve').toLowerCase();
    // both the fill and the stroke color survive — not collapsed to one paint
    expect(out).toContain('#1763cf');
    expect(out).toContain('#1354ae');
  });
});
