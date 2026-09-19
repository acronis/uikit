// Framework-agnostic text-decoration utility class(es). Not covered by
// `.ui-typography-*`: the typography composite transform only emits
// font-family/font-size/font-weight/line-height/letter-spacing (see
// `typography-css-class.ts`), never `text-decoration`/`text-underline-offset`
// — so a link's underline offset genuinely has no existing home. A single
// fixed value (PLTFRM-94106: 6 files), not a scale — no design token behind
// it.

/** Static, non-token-driven text-decoration utility classes, emitted once per build. */
export const STATIC_TEXT_DECORATION_CLASSES: ReadonlyMap<string, string> = new Map([
  ['.ui-underline-offset-4', 'text-underline-offset: 4px;'],
]);
