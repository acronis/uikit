import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('acronis white-label theme', () => {
  it('sets a default font-family in the base mixin', () => {
    const themeFile = readFileSync(
      resolve(process.cwd(), 'src/styles/themes/acronis-white-label.scss'),
      'utf-8'
    );

    expect(themeFile).toContain('@mixin theme-acronis-white-label-base {');
    expect(themeFile).toContain('font-family: var(');
    expect(themeFile).toContain('--av-font-sans');
  });
});
