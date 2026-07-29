import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  BREAKPOINT_2XL,
  BREAKPOINT_3XL,
  BREAKPOINT_4XL,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  getViewportWidth,
  ROOT_FONT_SIZE_PX,
} from '../breakpoints';

const INDEX_CSS_PATH = join(import.meta.dirname, '../../styles/index.css');
const indexCss = readFileSync(INDEX_CSS_PATH, 'utf-8');

function readThemeRem(name: string): number {
  const match = indexCss.match(new RegExp(`--breakpoint-${name}:\\s*([\\d.]+)rem;`));
  if (!match) throw new Error(`--breakpoint-${name} not found in index.css @theme block`);
  return Number(match[1]) * ROOT_FONT_SIZE_PX;
}

function readRootPx(name: string): number {
  const match = indexCss.match(new RegExp(`--ui-breakpoint-${name}:\\s*(\\d+)px;`));
  if (!match) throw new Error(`--ui-breakpoint-${name} not found in index.css :root/:host block`);
  return Number(match[1]);
}

describe('breakpoints', () => {
  it('matches the px values pinned in src/styles/index.css', () => {
    expect(BREAKPOINT_LG).toBe(1024);
    expect(BREAKPOINT_XL).toBe(1280);
    expect(BREAKPOINT_2XL).toBe(1440);
    expect(BREAKPOINT_3XL).toBe(1680);
    expect(BREAKPOINT_4XL).toBe(1920);
  });

  it('matches the @theme block in src/styles/index.css', () => {
    expect(BREAKPOINT_LG).toBe(readThemeRem('lg'));
    expect(BREAKPOINT_XL).toBe(readThemeRem('xl'));
    expect(BREAKPOINT_2XL).toBe(readThemeRem('2xl'));
    expect(BREAKPOINT_3XL).toBe(readThemeRem('3xl'));
    expect(BREAKPOINT_4XL).toBe(readThemeRem('4xl'));
  });

  it('matches the --ui-breakpoint-* :root/:host block in src/styles/index.css', () => {
    expect(BREAKPOINT_LG).toBe(readRootPx('lg'));
    expect(BREAKPOINT_XL).toBe(readRootPx('xl'));
    expect(BREAKPOINT_2XL).toBe(readRootPx('2xl'));
    expect(BREAKPOINT_3XL).toBe(readRootPx('3xl'));
    expect(BREAKPOINT_4XL).toBe(readRootPx('4xl'));
  });
});

describe('getViewportWidth', () => {
  it('returns window.innerWidth', () => {
    expect(getViewportWidth()).toBe(window.innerWidth);
  });
});
