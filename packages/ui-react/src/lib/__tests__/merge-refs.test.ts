import { describe, expect, it, vi } from 'vitest';

import { mergeRefs } from '../merge-refs';

describe('mergeRefs', () => {
  it('sets the node on every object ref', () => {
    const refA = { current: null as HTMLDivElement | null };
    const refB = { current: null as HTMLDivElement | null };
    const node = {} as HTMLDivElement;

    mergeRefs(refA, refB)(node);

    expect(refA.current).toBe(node);
    expect(refB.current).toBe(node);
  });

  it('calls every callback ref with the node', () => {
    const callbackA = vi.fn();
    const callbackB = vi.fn();
    const node = {} as HTMLDivElement;

    mergeRefs(callbackA, callbackB)(node);

    expect(callbackA).toHaveBeenCalledWith(node);
    expect(callbackB).toHaveBeenCalledWith(node);
  });

  it('handles a mix of object refs, callback refs, null, and undefined', () => {
    const objectRef = { current: null as HTMLDivElement | null };
    const callbackRef = vi.fn();
    const node = {} as HTMLDivElement;

    expect(() =>
      mergeRefs(objectRef, callbackRef, null, undefined)(node)
    ).not.toThrow();
    expect(objectRef.current).toBe(node);
    expect(callbackRef).toHaveBeenCalledWith(node);
  });

  it('propagates null to every ref on unmount', () => {
    const objectRef = { current: {} as HTMLDivElement | null };
    const callbackRef = vi.fn();
    const merged = mergeRefs(objectRef, callbackRef);

    merged({} as HTMLDivElement);
    merged(null);

    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it('does nothing when called with no refs', () => {
    expect(() => mergeRefs()({} as HTMLDivElement)).not.toThrow();
  });
});
