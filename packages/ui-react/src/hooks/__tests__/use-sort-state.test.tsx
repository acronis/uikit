import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSortState } from '../use-sort-state';

interface Row {
  name: string;
  size: number;
}

const data: Row[] = [
  { name: 'item10', size: 30 },
  { name: 'item2', size: 10 },
  { name: 'item1', size: 20 },
];

describe('useSortState', () => {
  it('returns the original data when unsorted', () => {
    const { result } = renderHook(() => useSortState({ data }));
    expect(result.current.sortedData).toEqual(data);
    expect(result.current.sort).toBeNull();
    expect(result.current.getSortDirection('name')).toBe(false);
  });

  it('sorts alphanumerically (natural order) ascending', () => {
    const { result } = renderHook(() => useSortState({ data }));
    act(() => result.current.toggleSort('name'));
    expect(result.current.sortedData.map((r) => r.name)).toEqual([
      'item1',
      'item2',
      'item10',
    ]);
    expect(result.current.getSortDirection('name')).toBe('asc');
  });

  it('cycles none → asc → desc → none on repeated toggles', () => {
    const { result } = renderHook(() => useSortState({ data }));
    act(() => result.current.toggleSort('size'));
    expect(result.current.sortedData.map((r) => r.size)).toEqual([10, 20, 30]);
    act(() => result.current.toggleSort('size'));
    expect(result.current.getSortDirection('size')).toBe('desc');
    expect(result.current.sortedData.map((r) => r.size)).toEqual([30, 20, 10]);
    act(() => result.current.toggleSort('size'));
    expect(result.current.sort).toBeNull();
    expect(result.current.sortedData).toEqual(data);
  });

  it('switches the sorted column and resets to asc', () => {
    const { result } = renderHook(() =>
      useSortState({ data, initialSort: { columnId: 'size', direction: 'desc' } })
    );
    act(() => result.current.toggleSort('name'));
    expect(result.current.getSortDirection('size')).toBe(false);
    expect(result.current.getSortDirection('name')).toBe('asc');
  });

  it('honors a custom per-column comparator', () => {
    const { result } = renderHook(() =>
      useSortState<Row>({
        data,
        comparators: { name: (a, b) => a.size - b.size },
      })
    );
    act(() => result.current.toggleSort('name'));
    // sorted by size even though the column id is `name`
    expect(result.current.sortedData.map((r) => r.size)).toEqual([10, 20, 30]);
  });
});
