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
    expect(getSnapshotIdentifier('ui-button--default', 'light')).toBe(
      'ui-button--default'
    );
    expect(getSnapshotIdentifier('ui-button--default', 'dark')).toBe(
      'ui-button--default--dark'
    );
  });
});
