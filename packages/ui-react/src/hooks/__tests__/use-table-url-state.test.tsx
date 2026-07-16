import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  parseTableUrlState,
  serializeTableUrlState,
  useTableUrlState,
  type TableUrlState,
} from '../use-table-url-state';

const emptyState: TableUrlState = {
  pagination: { pageIndex: 0, pageSize: 10 },
  sorting: [],
  columnFilters: [],
};

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('parse/serialize', () => {
  it('round-trips pagination, sorting and filters', () => {
    const state: TableUrlState = {
      pagination: { pageIndex: 2, pageSize: 25 },
      sorting: [{ id: 'name', desc: true }],
      columnFilters: [{ id: 'status', value: 'a, b:c' }],
    };
    const search = serializeTableUrlState(state, '');
    expect(parseTableUrlState(search)).toEqual(state);
  });

  it('encodes 1-based page and omits defaults', () => {
    const search = serializeTableUrlState(
      { ...emptyState, pagination: { pageIndex: 4, pageSize: 10 } },
      ''
    );
    expect(search).toBe('tbl_page=5');
  });

  it('preserves foreign params (e.g. Storybook path/args)', () => {
    const search = serializeTableUrlState(
      { ...emptyState, pagination: { pageIndex: 1, pageSize: 10 } },
      '?path=/story/ui-table--default&args=foo'
    );
    const params = new URLSearchParams(search);
    expect(params.get('path')).toBe('/story/ui-table--default');
    expect(params.get('args')).toBe('foo');
    expect(params.get('tbl_page')).toBe('2');
  });

  it('reads defaults from an empty search', () => {
    expect(parseTableUrlState('')).toEqual(emptyState);
  });

  it('drops a malformed percent-encoded filter value instead of throwing', () => {
    expect(parseTableUrlState('tbl_filter=status%3A%')).toEqual(emptyState);
  });

  it('dedupes a duplicate sort id, keeping the last occurrence', () => {
    expect(parseTableUrlState('tbl_sort=name:asc,name:desc').sorting).toEqual([
      { id: 'name', desc: true },
    ]);
  });

  it('drops a sort entry with a malformed (extra-colon) direction', () => {
    expect(parseTableUrlState('tbl_sort=name:desc:extra').sorting).toEqual([]);
  });
});

describe('useTableUrlState', () => {
  it('reads initial state from a pre-existing URL (bookmarked link)', () => {
    window.history.replaceState(null, '', '/?tbl_page=3&tbl_sort=name:desc');
    const { result } = renderHook(() => useTableUrlState());
    expect(result.current.state.pagination.pageIndex).toBe(2);
    expect(result.current.state.sorting).toEqual([{ id: 'name', desc: true }]);
  });

  it('writes state to the URL on change', () => {
    const { result } = renderHook(() => useTableUrlState());
    act(() =>
      result.current.setPagination((old) => ({ ...old, pageIndex: 3 }))
    );
    expect(window.location.search).toContain('tbl_page=4');
    expect(result.current.state.pagination.pageIndex).toBe(3);
  });

  it('accepts a plain value updater', () => {
    const { result } = renderHook(() => useTableUrlState());
    act(() => result.current.setSorting([{ id: 'size', desc: false }]));
    expect(window.location.search).toContain('tbl_sort=size%3Aasc');
    expect(result.current.state.sorting).toEqual([{ id: 'size', desc: false }]);
  });

  it('two setters called synchronously in the same handler both survive', () => {
    // Mirrors table-full-demo.stories.tsx's handleFiltersChange, which calls
    // setColumnFilters then setPagination back-to-back in one event handler.
    const { result } = renderHook(() => useTableUrlState());
    act(() => {
      result.current.setColumnFilters([{ id: 'status', value: 'active' }]);
      result.current.setPagination((old) => ({ ...old, pageIndex: 0 }));
    });
    expect(result.current.state.columnFilters).toEqual([
      { id: 'status', value: 'active' },
    ]);
    expect(window.location.search).toContain('tbl_filter=status%3Aactive');
  });

  it('re-reads state on popstate (browser back/forward)', () => {
    const { result } = renderHook(() => useTableUrlState());
    window.history.replaceState(null, '', '/?tbl_page=5');
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));
    expect(result.current.state.pagination.pageIndex).toBe(4);
  });

  it('honors a custom default page size', () => {
    const { result } = renderHook(() =>
      useTableUrlState({ defaultPageSize: 25 })
    );
    expect(result.current.state.pagination.pageSize).toBe(25);
    act(() =>
      result.current.setPagination((old) => ({ ...old, pageSize: 25 }))
    );
    // matches default → dropped from the URL
    expect(window.location.search).not.toContain('tbl_size');
  });
});
