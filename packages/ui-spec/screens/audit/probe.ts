/// <reference lib="dom" />
// Browser probe for the screen audit.
//
// `collectScreenSnapshot` is meant to run **inside the page** — it is passed to
// Playwright's `page.evaluate(...)` (the existing VR harness) or injected via the
// chrome-devtools MCP `evaluate_script` against a running Storybook story. Because
// the function is serialized and re-parsed in the browser, it MUST be fully
// self-contained: every helper is declared inside it, and it references only DOM
// globals and its single argument — no module-scope imports at runtime.
//
// It returns a plain `ScreenSnapshot` (see ./types.ts) with no DOM handles, so the
// pure detectors can run over it in Node. See context/kit-consistency-audit-proposal.md §7.2.
import type { ScreenSnapshot, SnapshotNode } from './types';

export interface ProbeOptions {
  screen: string;
  story?: string;
  colorMode: 'light' | 'dark';
  /** Root to measure under (defaults to `#storybook-root`, then `body`). */
  rootSelector?: string;
  /** Cap on text length captured per node. */
  maxText?: number;
}

export function collectScreenSnapshot(opts: ProbeOptions): ScreenSnapshot {
  const maxText = opts.maxText ?? 80;
  const root =
    (opts.rootSelector && document.querySelector(opts.rootSelector)) ||
    document.querySelector('#storybook-root') ||
    document.body;

  const LANDMARK_TAG: Record<string, string> = {
    HEADER: 'banner',
    NAV: 'navigation',
    MAIN: 'main',
    ASIDE: 'complementary',
    FOOTER: 'contentinfo',
  };
  const LANDMARK_ROLE = new Set([
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'region',
    'search',
  ]);
  const INTERACTIVE_TAG = new Set([
    'BUTTON',
    'A',
    'INPUT',
    'SELECT',
    'TEXTAREA',
  ]);
  const INTERACTIVE_ROLE = new Set([
    'button',
    'link',
    'checkbox',
    'radio',
    'switch',
    'menuitem',
    'tab',
    'combobox',
    'textbox',
    'slider',
    'option',
    'searchbox',
  ]);

  const landmarkOf = (el: Element): { el: Element; role: string } | null => {
    let cur: Element | null = el;
    while (cur && cur !== document.documentElement) {
      const role = cur.getAttribute('role');
      if (role && LANDMARK_ROLE.has(role)) return { el: cur, role };
      const tagRole = LANDMARK_TAG[cur.tagName];
      if (tagRole) return { el: cur, role: tagRole };
      cur = cur.parentElement;
    }
    return null;
  };

  const isTransparent = (c: string): boolean =>
    c === 'transparent' ||
    c === 'rgba(0, 0, 0, 0)' ||
    /,\s*0\s*\)$/.test(c.replace(/\s/g, '').replace(/,0\)$/, ', 0)'));

  const effectiveBg = (el: Element): string => {
    let cur: Element | null = el;
    while (cur) {
      const bg = getComputedStyle(cur).backgroundColor;
      if (bg && !isTransparent(bg)) return bg;
      cur = cur.parentElement;
    }
    return 'rgb(255, 255, 255)';
  };

  const accessibleName = (el: Element): string | null => {
    const label = el.getAttribute('aria-label');
    if (label && label.trim()) return label.trim();
    const labelledby = el.getAttribute('aria-labelledby');
    if (labelledby) {
      const text = labelledby
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ');
      if (text) return text;
    }
    const title = el.getAttribute('title');
    if (title && title.trim()) return title.trim();
    if (el.tagName === 'IMG') {
      const alt = el.getAttribute('alt');
      if (alt && alt.trim()) return alt.trim();
    }
    const txt = (el.textContent ?? '').trim();
    return txt || null;
  };

  // Short, reasonably-stable locator for reporting.
  const refOf = (el: Element): string => {
    const parts: string[] = [];
    let cur: Element | null = el;
    let depth = 0;
    while (cur && cur !== root && cur !== document.body && depth < 4) {
      const tag = cur.tagName.toLowerCase();
      const parent = cur.parentElement;
      if (parent) {
        const sameTag = Array.prototype.filter.call(
          parent.children,
          (c: Element) => c.tagName === cur!.tagName
        );
        const idx = sameTag.indexOf(cur);
        parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${idx + 1})` : tag);
      } else {
        parts.unshift(tag);
      }
      cur = cur.parentElement;
      depth += 1;
    }
    return parts.join(' > ') || el.tagName.toLowerCase();
  };

  const num = (v: string): number => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const nodes: SnapshotNode[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let el = walker.currentNode as Element | null;
  // The TreeWalker starts on `root` itself; iterate over descendants.
  for (el = walker.nextNode() as Element | null; el; el = walker.nextNode() as Element | null) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    const role = el.getAttribute('role');
    const lm = landmarkOf(el);
    const tag = el.tagName.toLowerCase();
    const isIcon =
      el.tagName === 'svg' || el.getAttribute('data-slot') === 'icon';
    const isControl =
      INTERACTIVE_TAG.has(el.tagName) ||
      (role != null && INTERACTIVE_ROLE.has(role));
    const isDisabled =
      el.hasAttribute('disabled') ||
      el.getAttribute('aria-disabled') === 'true';
    const interactive = isControl && !isDisabled;
    const disabled = isControl && isDisabled;

    const borderX =
      num(style.borderLeftWidth) + num(style.borderRightWidth);
    const borderY =
      num(style.borderTopWidth) + num(style.borderBottomWidth);
    const he = el as HTMLElement;
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const scrollsY =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      he.scrollHeight > he.clientHeight + 1;
    const scrollsX =
      (overflowX === 'auto' || overflowX === 'scroll') &&
      he.scrollWidth > he.clientWidth + 1;
    const gutterX = scrollsY
      ? Math.max(0, Math.round(he.offsetWidth - he.clientWidth - borderX))
      : 0;
    const gutterY = scrollsX
      ? Math.max(0, Math.round(he.offsetHeight - he.clientHeight - borderY))
      : 0;

    nodes.push({
      ref: refOf(el),
      tag,
      role,
      region: lm?.role ?? null,
      regionChild: lm ? el.parentElement === lm.el : false,
      text: (el.textContent ?? '').trim().slice(0, maxText),
      accessibleName:
        interactive || disabled || el.tagName === 'IMG'
          ? accessibleName(el)
          : null,
      interactive,
      disabled,
      isIcon,
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      opacity: style.opacity === '' ? 1 : num(style.opacity),
      color: style.color,
      backgroundColor: effectiveBg(el),
      fontSize: Math.round(num(style.fontSize) * 100) / 100,
      fontWeight: num(style.fontWeight) || 400,
      borderRadius: Math.round(num(style.borderTopLeftRadius)),
      gutterX,
      gutterY,
    });
  }

  return {
    screen: opts.screen,
    story: opts.story,
    colorMode: opts.colorMode,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    nodes,
  };
}
