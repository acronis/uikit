import { describe, expect, it } from 'vitest';

import { deepEqual } from '../deep-equal';

describe('deepEqual', () => {
  it('treats identical primitives as equal', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('a', 'a')).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, null)).toBe(true);
  });

  it('treats different primitives as unequal', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('a', 'b')).toBe(false);
    expect(deepEqual(undefined, null)).toBe(false);
  });

  it('treats a primitive and an object as unequal', () => {
    expect(deepEqual(1, { valueOf: () => 1 })).toBe(false);
    expect(deepEqual(null, {})).toBe(false);
  });

  it('compares plain objects by value, regardless of key order', () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('recurses into nested objects', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  it('treats same-length disjoint-key objects as unequal, even when values are undefined', () => {
    expect(deepEqual({ a: undefined }, { b: undefined })).toBe(false);
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('compares arrays by value and length, order-sensitively', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('treats an array and an object as unequal', () => {
    expect(deepEqual([], {})).toBe(false);
  });

  it('recurses into arrays of objects', () => {
    expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
    expect(deepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false);
  });

  it('compares Dates by time value, not identity', () => {
    expect(deepEqual(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(true);
    expect(deepEqual(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
    expect(deepEqual(new Date(2024, 0, 1), {})).toBe(false);
  });

  it('compares Sets by member value, regardless of insertion order', () => {
    expect(deepEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(deepEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
    expect(deepEqual(new Set([1, 2]), new Set([1]))).toBe(false);
    expect(deepEqual(new Set(), {})).toBe(false);
  });

  it('compares Maps by key/value pairs, regardless of insertion order', () => {
    expect(
      deepEqual(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
        new Map([
          ['b', 2],
          ['a', 1],
        ]),
      ),
    ).toBe(true);
    expect(deepEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false);
    expect(deepEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false);
    expect(deepEqual(new Map(), {})).toBe(false);
  });
});
