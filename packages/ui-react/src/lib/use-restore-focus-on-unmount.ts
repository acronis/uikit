import * as React from 'react';

/**
 * Restores keyboard focus when a focused descendant of `containerRef` is
 * conditionally unmounted (rather than disabled) and the browser's default
 * behavior drops focus to `document.body`. Generic across every control that
 * can appear/disappear inside the container — it doesn't track *which* one
 * unmounted, only whether focus was somewhere inside the container right
 * before a commit and is now nowhere (`document.body`) after it.
 *
 * `wasFocusInside` is captured during render, not in an effect: by the time
 * any effect runs, React has already applied the commit's mutations and the
 * browser has already blurred the removed element to `document.body`, so
 * checking "was it focused" after the fact would always see `body`. The only
 * point where the pre-mutation focus state is still readable is before this
 * render's fiber is committed.
 *
 * The redirect effect intentionally has no dependency array — it isn't keyed
 * to a specific prop change, only to "did the DOM just drop focus to body,"
 * which can only be observed after the fact, on every commit.
 *
 * `fallbackRefs` is checked in order; the first one with a mounted node
 * receives focus. Pass every control that can occupy the vacated slot, most
 * preferred first.
 *
 * The latch is cleared, not just set, during render: without an `else`, once
 * focus had been inside the container it would stay "was inside" forever,
 * even after focus later moves to some unrelated element outside the
 * container without an unmount. Since the effect below runs on every commit
 * (no dependency array), a later, wholly unrelated blur-to-`document.body`
 * would then incorrectly yank focus back into `fallbackRefs`.
 */
export function useRestoreFocusOnUnmount(
  containerRef: React.RefObject<HTMLElement | null>,
  fallbackRefs: React.RefObject<HTMLElement | null>[]
): void {
  const wasFocusInsideRef = React.useRef(false);

  if (containerRef.current?.contains(document.activeElement)) {
    wasFocusInsideRef.current = true;
  } else if (document.activeElement !== document.body) {
    wasFocusInsideRef.current = false;
  }

  React.useEffect(() => {
    if (
      !wasFocusInsideRef.current ||
      document.activeElement !== document.body
    ) {
      return;
    }
    wasFocusInsideRef.current = false;
    fallbackRefs.find((fallbackRef) => fallbackRef.current)?.current?.focus();
  });
}
