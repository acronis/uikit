import * as React from 'react';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

import { middleTruncate } from './middle-truncate';
import { measureTextWidth } from './text-width';

type TooltipContentProps = React.ComponentProps<typeof TooltipContent>;

export interface TruncateTextProps {
  /** The text to display. Also used verbatim as the tooltip body when truncated. */
  children: string;
  /**
   * Where the ellipsis goes. `'end'` (default) is the familiar CSS
   * `text-overflow: ellipsis` — reach for `'middle'` when the distinguishing
   * part of the value is at the tail (a URL, a hash) rather than the start.
   */
  mode?: 'middle' | 'end';
  /** Which side the tooltip opens on. Defaults to `top`. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Max lines before truncating, in `'end'` mode only: `1` (default) =
   * single-line ellipsis; `>1` = a multi-line clamp. Ignored in `'middle'`
   * mode, which is inherently single-line.
   */
  lines?: number;
  /**
   * Force the tooltip open on mount (only has effect when the text is truncated).
   * Mainly for stories / visual review; normal usage reveals it on hover/focus.
   */
  defaultOpen?: boolean;
  /**
   * Container the tooltip popup portals into. Pass a shadow root (e.g. a
   * micro-frontend mount point) so the popup inherits the kit's styles; defaults
   * to the document body.
   */
  portalContainer?: TooltipContentProps['portalContainer'];
  /** Merged onto the rendered `<span>`. */
  className?: string;
}

/**
 * Text that truncates with an ellipsis and reveals its full value in a tooltip
 * **only when it's actually clipped** — the tooltip is skipped when everything
 * fits, so short cells don't get a pointless hover target. Ideal for table cells.
 *
 * `'end'`-mode truncation is detected by comparing scroll vs client size and
 * re-checked on resize; `'middle'`-mode measures a real font metric via canvas
 * (there is no native CSS middle-ellipsis) and re-measures the same way.
 */
export const TruncateText = React.forwardRef<HTMLSpanElement, TruncateTextProps>(
  function TruncateText(
    { children, mode = 'end', className, side = 'top', lines = 1, defaultOpen, portalContainer },
    forwardedRef
  ) {
    if (mode === 'middle') {
      return (
        <TruncateTextMiddle
          ref={forwardedRef}
          text={children}
          side={side}
          portalContainer={portalContainer}
          className={className}
        />
      );
    }

    return (
      <TruncateTextEnd
        ref={forwardedRef}
        text={children}
        side={side}
        lines={lines}
        defaultOpen={defaultOpen}
        portalContainer={portalContainer}
        className={className}
      />
    );
  }
);

interface TruncateTextEndProps {
  text: string;
  side: 'top' | 'bottom' | 'left' | 'right';
  lines: number;
  defaultOpen: boolean | undefined;
  portalContainer: TooltipContentProps['portalContainer'];
  className: string | undefined;
}

/** The CSS end-ellipsis / multi-line-clamp half of `TruncateText`. */
const TruncateTextEnd = React.forwardRef<HTMLSpanElement, TruncateTextEndProps>(
  function TruncateTextEnd(
    { text, side, lines, defaultOpen, portalContainer, className },
    forwardedRef
  ) {
    const innerRef = React.useRef<HTMLSpanElement | null>(null);
    const [truncated, setTruncated] = React.useState(false);

    // The component owns a ref for overflow measurement; still forward it so
    // callers can reach the underlying span.
    const setRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    React.useLayoutEffect(() => {
      const node = innerRef.current;
      if (!node) return;
      // +1 guards against sub-pixel rounding falsely reporting overflow.
      // Genuine DOM-measuring layout effect: overflow can only be read after
      // layout, so the sync setState here is required, not incidental.
      const check = () =>
        setTruncated(
          lines > 1
            ? node.scrollHeight > node.clientHeight + 1
            : node.scrollWidth > node.clientWidth + 1
        );
      check();
      const observer = new ResizeObserver(check);
      observer.observe(node);
      return () => observer.disconnect();
      // `truncated` is a dep so the observer re-attaches to the span after it moves
      // into / out of the tooltip trigger on the truncation flip.
    }, [text, lines, truncated]);

    const multiline = lines > 1;
    const style: React.CSSProperties | undefined = multiline
      ? {
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }
      : undefined;

    const span = (
      <span
        ref={setRef}
        className={cn('block', multiline ? 'overflow-hidden' : 'truncate', className)}
        style={style}
      >
        {text}
      </span>
    );

    if (!truncated) return span;

    return (
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger render={span} />
        <TooltipContent side={side} portalContainer={portalContainer}>
          {text}
        </TooltipContent>
      </Tooltip>
    );
  }
);

interface TruncateTextMiddleProps {
  text: string;
  side: 'top' | 'bottom' | 'left' | 'right';
  portalContainer: TooltipContentProps['portalContainer'];
  className: string | undefined;
}

/**
 * The middle-ellipsis half of `TruncateText`. Sizes to the container, not the
 * other way around — it needs no `size`/`maxSize` on a column or wrapper to
 * have something to truncate against: it measures whatever width it is
 * actually rendered at, however that width was arrived at, and re-measures
 * via `ResizeObserver` if it changes.
 */
const TruncateTextMiddle = React.forwardRef<HTMLSpanElement, TruncateTextMiddleProps>(
  function TruncateTextMiddle({ text, side, portalContainer, className }, forwardedRef) {
    const [node, setNode] = React.useState<HTMLSpanElement | null>(null);
    const [display, setDisplay] = React.useState(text);
    // Distinct from `display !== text`: that's also true before the first
    // measurement (the initial state is the untruncated `text`), and this needs
    // to tell "genuinely fits, confirmed by measuring" apart from "haven't
    // measured yet" — see the class-name comment below for why they can't share
    // one flag.
    const [measured, setMeasured] = React.useState(false);

    const setRefs = React.useCallback(
      (element: HTMLSpanElement | null) => {
        setNode(element);
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      },
      [forwardedRef]
    );

    // Depends on `node`, not just `text` — the trigger/no-trigger branch below
    // swaps this span between being `<Tooltip>`'s child and being the whole
    // return value, which are different positions in the tree, so React remounts
    // it (a new DOM node) rather than reusing the old one. A `[text]`-only effect
    // would keep observing the now-detached old node and never see the
    // replacement, silently going stale the moment truncation state flips.
    React.useLayoutEffect(() => {
      setMeasured(false);
      if (node === null || typeof ResizeObserver === 'undefined') {
        setDisplay(text);
        return;
      }

      const recompute = () => {
        const width = node.clientWidth;
        // 0 during the node's first layout tick (or while a hidden ancestor is
        // still collapsed) — skip rather than truncate against a width that
        // isn't real yet; the observer fires again once it settles.
        if (width === 0) return;
        const font = getComputedStyle(node).font;
        setDisplay(
          middleTruncate(text, width, {
            measure: (candidate) => measureTextWidth(candidate, font),
          })
        );
        setMeasured(true);
      };

      recompute();
      const observer = new ResizeObserver(recompute);
      observer.observe(node);
      return () => observer.disconnect();
    }, [node, text]);

    const span = (
      <span
        ref={setRefs}
        className={cn(
          // `flex-1` (`flex: 1 1 0%`) only takes effect when the parent this
          // renders into happens to itself be a flex container — inert
          // otherwise, so it's safe alongside `block`. It's not decorative:
          // without it, a `display: block` element with no explicit width
          // only *auto-fills a plain block parent* — the browser's default
          // "fill available width" rule for `width: auto` is specific to
          // block layout. Nested inside a flex parent (a caller's own cell
          // wrapping this next to an icon button, say), the same element
          // becomes a flex item instead, where `flex-basis: auto` means
          // "size to your own content" — and this component's own content
          // is whatever it truncated itself to *last* time. Once shrunk, it
          // would then measure its own shrunken self forever, growing back
          // only if some ancestor's width changed enough to force a reflow
          // for an unrelated reason — not when the column actually had more
          // room to give it all along.
          'block min-w-0 flex-1',
          // Nowrap + clip only once `measured` — *before* that, this is the
          // string's first-ever render, and if it already clips and refuses to
          // wrap, it dictates its own column's width to `table-layout: auto`
          // before `ResizeObserver` ever gets a turn: nowrap makes an unbroken
          // string's min-content the string's *entire* rendered width, so the
          // browser hands the column exactly that much room — measuring
          // `clientWidth` after the fact just reads back the width this same
          // element inflated the column to, not the width some other column
          // needed and this one gave up.
          //
          // Left at the browser's own default on the unmeasured pass rather than
          // forced to `overflow-wrap: anywhere` — tried that first, and it
          // overcorrects: telling `auto`-layout this column's min-content is a
          // single character makes it treat the column as free to take almost
          // nothing, starving it in favor of siblings with a normal (space- and
          // punctuation-driven) min-content. The browser's own line-breaking
          // already finds break opportunities in a URL — after `/`, around `?`,
          // `=`, `_` — without being told everything is breakable, which is
          // exactly the multi-line wrap this component exists to replace: worse
          // than what `nowrap` would give it, but a real, usable column width to
          // hand to the first `ResizeObserver` measurement, not a starved one.
          measured && 'overflow-hidden whitespace-nowrap',
          className
        )}
      >
        {display}
      </span>
    );

    if (display === text) return span;

    return (
      <Tooltip>
        <TooltipTrigger render={span} />
        <TooltipContent side={side} portalContainer={portalContainer}>
          {text}
        </TooltipContent>
      </Tooltip>
    );
  }
);
