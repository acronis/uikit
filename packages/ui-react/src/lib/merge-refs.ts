import * as React from 'react';

/**
 * Combines multiple refs (any mix of callback refs, object refs, or
 * null/undefined) into a single ref callback that updates all of them with
 * the same node. Needed because a DOM element accepts exactly one `ref`
 * prop, but a component sometimes needs both its own internal ref (e.g. for
 * a hook that reads the node directly) and to forward a caller-supplied ref
 * onto that same node.
 */
export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<T | null>).current = node;
      }
    }
  };
}
