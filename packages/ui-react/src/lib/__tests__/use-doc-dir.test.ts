import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useDocDir } from '../use-doc-dir';

afterEach(() => {
  document.documentElement.removeAttribute('dir');
  document.documentElement.style.direction = '';
});

describe('useDocDir', () => {
  it('reports rtl when the dir attribute is rtl', () => {
    document.documentElement.dir = 'rtl';
    const { result } = renderHook(() => useDocDir());
    expect(result.current).toBe('rtl');
  });

  it('reports ltr when the dir attribute is ltr', () => {
    document.documentElement.dir = 'ltr';
    const { result } = renderHook(() => useDocDir());
    expect(result.current).toBe('ltr');
  });

  it('reports ltr when no dir attribute or direction style is set', () => {
    const { result } = renderHook(() => useDocDir());
    expect(result.current).toBe('ltr');
  });

  it('reports rtl when direction is set via CSS only (no dir attribute)', () => {
    document.documentElement.style.direction = 'rtl';
    const { result } = renderHook(() => useDocDir());
    expect(result.current).toBe('rtl');
  });

  it('does not re-sync after mount when dir changes later (no live reactivity)', () => {
    const { result, rerender } = renderHook(() => useDocDir());
    expect(result.current).toBe('ltr');

    document.documentElement.dir = 'rtl';
    rerender();

    expect(result.current).toBe('ltr');
  });
});
