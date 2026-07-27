import { describe, expect, it } from 'vitest';

import {
  BREAKPOINT_2XL,
  BREAKPOINT_3XL,
  BREAKPOINT_4XL,
  BREAKPOINT_LG,
  BREAKPOINT_MD,
  BREAKPOINT_SM,
  BREAKPOINT_XL,
  getViewportWidth,
} from '../breakpoints';

describe('breakpoints', () => {
  it('matches the px values pinned in src/styles/index.css', () => {
    expect(BREAKPOINT_SM).toBe(640);
    expect(BREAKPOINT_MD).toBe(768);
    expect(BREAKPOINT_LG).toBe(1024);
    expect(BREAKPOINT_XL).toBe(1280);
    expect(BREAKPOINT_2XL).toBe(1440);
    expect(BREAKPOINT_3XL).toBe(1680);
    expect(BREAKPOINT_4XL).toBe(1920);
  });
});

describe('getViewportWidth', () => {
  it('returns window.innerWidth', () => {
    expect(getViewportWidth()).toBe(window.innerWidth);
  });
});
