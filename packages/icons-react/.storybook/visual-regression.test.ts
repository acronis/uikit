import {
  getSnapshotIdentifier,
  resolveVisualColorMode,
} from './visual-regression';

describe('visual regression helpers', () => {
  it('defaults color mode to light', () => {
    expect(resolveVisualColorMode(undefined)).toBe('light');
    expect(resolveVisualColorMode('invalid')).toBe('light');
  });

  it('resolves dark color mode', () => {
    expect(resolveVisualColorMode('dark')).toBe('dark');
  });

  it('suffixes dark snapshot identifiers', () => {
    expect(getSnapshotIdentifier('icons-packs--solid-mono', 'light')).toBe(
      'icons-packs--solid-mono'
    );
    expect(getSnapshotIdentifier('icons-packs--solid-mono', 'dark')).toBe(
      'icons-packs--solid-mono--dark'
    );
  });
});
