// Framework-agnostic layout & text-flow utility classes — flex, grid,
// alignment (in and out of flex/grid), text wrapping/overflow, and display.
// None of this is token-derived: these are finite, fixed sets copied wholesale
// from Tailwind's own utility groups (same principle as the spacing grammar's
// "generate the whole scale, not a hand-picked subset" rule), so they render
// once per build via STATIC_LAYOUT_CLASSES rather than looping over a token
// stream. Deliberately excludes anything typographic (font-size/weight/
// family/line-height/letter-spacing) — those stay owned by `.ui-typography-*`.

const GRID_COLS = 12;
const GRID_ROWS = 6;
const LINE_CLAMP_MAX = 6;

function numberedClasses(
  prefix: string,
  count: number,
  render: (n: number) => string
): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  for (let n = 1; n <= count; n++) {
    entries.push([`.ui-${prefix}-${n}`, render(n)]);
  }
  return entries;
}

const FLEX: Array<[string, string]> = [
  ['.ui-flex', 'display: flex;'],
  ['.ui-inline-flex', 'display: inline-flex;'],
  ['.ui-flex-row', 'flex-direction: row;'],
  ['.ui-flex-row-reverse', 'flex-direction: row-reverse;'],
  ['.ui-flex-col', 'flex-direction: column;'],
  ['.ui-flex-col-reverse', 'flex-direction: column-reverse;'],
  ['.ui-flex-wrap', 'flex-wrap: wrap;'],
  ['.ui-flex-wrap-reverse', 'flex-wrap: wrap-reverse;'],
  ['.ui-flex-nowrap', 'flex-wrap: nowrap;'],
  ['.ui-flex-1', 'flex: 1 1 0%;'],
  ['.ui-flex-auto', 'flex: 1 1 auto;'],
  ['.ui-flex-initial', 'flex: 0 1 auto;'],
  ['.ui-flex-none', 'flex: none;'],
  ['.ui-grow', 'flex-grow: 1;'],
  ['.ui-grow-0', 'flex-grow: 0;'],
  ['.ui-shrink', 'flex-shrink: 1;'],
  ['.ui-shrink-0', 'flex-shrink: 0;'],
];

const GRID: Array<[string, string]> = [
  ['.ui-grid', 'display: grid;'],
  ['.ui-inline-grid', 'display: inline-grid;'],
  ...numberedClasses(
    'grid-cols',
    GRID_COLS,
    (n) => `grid-template-columns: repeat(${n}, minmax(0, 1fr));`
  ),
  ...numberedClasses(
    'grid-rows',
    GRID_ROWS,
    (n) => `grid-template-rows: repeat(${n}, minmax(0, 1fr));`
  ),
  ...numberedClasses('col-span', GRID_COLS, (n) => `grid-column: span ${n} / span ${n};`),
  ...numberedClasses('row-span', GRID_ROWS, (n) => `grid-row: span ${n} / span ${n};`),
];

const FLEX_GRID_ALIGNMENT: Array<[string, string]> = [
  ['.ui-items-start', 'align-items: flex-start;'],
  ['.ui-items-end', 'align-items: flex-end;'],
  ['.ui-items-center', 'align-items: center;'],
  ['.ui-items-baseline', 'align-items: baseline;'],
  ['.ui-items-stretch', 'align-items: stretch;'],
  ['.ui-justify-start', 'justify-content: flex-start;'],
  ['.ui-justify-end', 'justify-content: flex-end;'],
  ['.ui-justify-center', 'justify-content: center;'],
  ['.ui-justify-between', 'justify-content: space-between;'],
  ['.ui-justify-around', 'justify-content: space-around;'],
  ['.ui-justify-evenly', 'justify-content: space-evenly;'],
  ['.ui-content-start', 'align-content: flex-start;'],
  ['.ui-content-end', 'align-content: flex-end;'],
  ['.ui-content-center', 'align-content: center;'],
  ['.ui-content-between', 'align-content: space-between;'],
  ['.ui-content-around', 'align-content: space-around;'],
  ['.ui-content-evenly', 'align-content: space-evenly;'],
  ['.ui-content-stretch', 'align-content: stretch;'],
  ['.ui-self-auto', 'align-self: auto;'],
  ['.ui-self-start', 'align-self: flex-start;'],
  ['.ui-self-end', 'align-self: flex-end;'],
  ['.ui-self-center', 'align-self: center;'],
  ['.ui-self-stretch', 'align-self: stretch;'],
  ['.ui-self-baseline', 'align-self: baseline;'],
  ['.ui-justify-self-auto', 'justify-self: auto;'],
  ['.ui-justify-self-start', 'justify-self: start;'],
  ['.ui-justify-self-end', 'justify-self: end;'],
  ['.ui-justify-self-center', 'justify-self: center;'],
  ['.ui-justify-self-stretch', 'justify-self: stretch;'],
];

const NON_FLEX_ALIGNMENT: Array<[string, string]> = [
  ['.ui-text-left', 'text-align: left;'],
  ['.ui-text-center', 'text-align: center;'],
  ['.ui-text-right', 'text-align: right;'],
  ['.ui-text-justify', 'text-align: justify;'],
  ['.ui-text-start', 'text-align: start;'],
  ['.ui-text-end', 'text-align: end;'],
  ['.ui-align-baseline', 'vertical-align: baseline;'],
  ['.ui-align-top', 'vertical-align: top;'],
  ['.ui-align-middle', 'vertical-align: middle;'],
  ['.ui-align-bottom', 'vertical-align: bottom;'],
  ['.ui-align-text-top', 'vertical-align: text-top;'],
  ['.ui-align-text-bottom', 'vertical-align: text-bottom;'],
  ['.ui-float-left', 'float: left;'],
  ['.ui-float-right', 'float: right;'],
  ['.ui-float-none', 'float: none;'],
  ['.ui-clear-left', 'clear: left;'],
  ['.ui-clear-right', 'clear: right;'],
  ['.ui-clear-both', 'clear: both;'],
  ['.ui-clear-none', 'clear: none;'],
];

const TEXT_FLOW: Array<[string, string]> = [
  ['.ui-whitespace-normal', 'white-space: normal;'],
  ['.ui-whitespace-nowrap', 'white-space: nowrap;'],
  ['.ui-whitespace-pre', 'white-space: pre;'],
  ['.ui-whitespace-pre-line', 'white-space: pre-line;'],
  ['.ui-whitespace-pre-wrap', 'white-space: pre-wrap;'],
  ['.ui-whitespace-break-spaces', 'white-space: break-spaces;'],
  ['.ui-break-normal', 'overflow-wrap: normal; word-break: normal;'],
  ['.ui-break-words', 'overflow-wrap: break-word;'],
  ['.ui-break-all', 'word-break: break-all;'],
  ['.ui-break-keep', 'word-break: keep-all;'],
  ['.ui-truncate', 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'],
  ['.ui-text-ellipsis', 'text-overflow: ellipsis;'],
  ['.ui-text-clip', 'text-overflow: clip;'],
  ['.ui-hyphens-none', 'hyphens: none;'],
  ['.ui-hyphens-manual', 'hyphens: manual;'],
  ['.ui-hyphens-auto', 'hyphens: auto;'],
  [
    '.ui-line-clamp-none',
    'overflow: visible; display: block; -webkit-box-orient: horizontal; -webkit-line-clamp: none;',
  ],
  ...numberedClasses(
    'line-clamp',
    LINE_CLAMP_MAX,
    (n) =>
      `overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${n};`
  ),
];

const DISPLAY: Array<[string, string]> = [
  ['.ui-block', 'display: block;'],
  ['.ui-inline-block', 'display: inline-block;'],
  ['.ui-inline', 'display: inline;'],
  ['.ui-hidden', 'display: none;'],
  ['.ui-contents', 'display: contents;'],
];

/** Static, non-token-driven layout + text-flow utility classes, emitted once per build. */
export const STATIC_LAYOUT_CLASSES: ReadonlyMap<string, string> = new Map([
  ...FLEX,
  ...GRID,
  ...FLEX_GRID_ALIGNMENT,
  ...NON_FLEX_ALIGNMENT,
  ...TEXT_FLOW,
  ...DISPLAY,
]);
