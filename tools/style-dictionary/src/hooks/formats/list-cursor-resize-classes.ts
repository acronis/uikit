// Framework-agnostic list-style, cursor, and resize utility classes — fixed,
// finite sets copied wholesale from Tailwind's own bounded utility groups
// (PLTFRM-94106's "misc/layout primitives" note: ship the whole group, not a
// hand-picked subset). Not token-driven — no design token behind any of
// these.

const LIST_STYLE: Array<[string, string]> = [
  ['.ui-list-disc', 'list-style-type: disc;'],
  ['.ui-list-decimal', 'list-style-type: decimal;'],
  ['.ui-list-none', 'list-style-type: none;'],
  ['.ui-list-inside', 'list-style-position: inside;'],
  ['.ui-list-outside', 'list-style-position: outside;'],
];

const CURSOR: Array<[string, string]> = [
  ['.ui-cursor-auto', 'cursor: auto;'],
  ['.ui-cursor-default', 'cursor: default;'],
  ['.ui-cursor-pointer', 'cursor: pointer;'],
  ['.ui-cursor-wait', 'cursor: wait;'],
  ['.ui-cursor-text', 'cursor: text;'],
  ['.ui-cursor-move', 'cursor: move;'],
  ['.ui-cursor-help', 'cursor: help;'],
  ['.ui-cursor-not-allowed', 'cursor: not-allowed;'],
  ['.ui-cursor-none', 'cursor: none;'],
  ['.ui-cursor-grab', 'cursor: grab;'],
  ['.ui-cursor-grabbing', 'cursor: grabbing;'],
  ['.ui-cursor-zoom-in', 'cursor: zoom-in;'],
  ['.ui-cursor-zoom-out', 'cursor: zoom-out;'],
];

const RESIZE: Array<[string, string]> = [
  ['.ui-resize-none', 'resize: none;'],
  ['.ui-resize', 'resize: both;'],
  ['.ui-resize-x', 'resize: horizontal;'],
  ['.ui-resize-y', 'resize: vertical;'],
];

/** Static, non-token-driven list-style/cursor/resize utility classes, emitted once per build. */
export const STATIC_LIST_CURSOR_RESIZE_CLASSES: ReadonlyMap<string, string> = new Map([
  ...LIST_STYLE,
  ...CURSOR,
  ...RESIZE,
]);
