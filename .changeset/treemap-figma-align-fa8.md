---
'@acronis-platform/ui-react': patch
---

fix(treemap): Figma-align Treemap — adaptive tile text, centered labels, 14px font

- **BREAKING**: `labelAlign` now defaults to `'center'` (was `'bottom-start'`).
  Pass `labelAlign="bottom-start"` to restore the old position.
- **BREAKING**: Tile label font changed from 12px semibold to 14px regular to
  match the Figma design. Label geometry thresholds updated accordingly
  (MIN_LABEL_HEIGHT 40→43px, MIN_TWO_LINE_HEIGHT 55→58px).
- Default palette changed to `{ type: 'diverging', pair: 'blue-orange' }` (was
  categorical). A treemap is most commonly used to show two-sided distributions,
  and the diverging palette's adaptive text works correctly out of the box.
- Tile corner radius removed (`CELL_RADIUS 6→0`) to match Figma.
- Tile text color is now adaptive, computed automatically from the resolved token
  name suffix — no `darkFill` prop needed from callers:
  - **Dark text**: diverging pale stops (a1, a2, b1, b2) and sequential stops 1–2.
  - **White text**: diverging strong stops (a3, b3), sequential stops 3–8, all
    categorical and status stops.
- Added `WidgetExample` story showing the treemap inside a `ChartWidget` with the
  diverging blue-orange palette (matches Figma node 8999:72036).
- Added `DivergingPalette`, `SequentialPalette`, and `StatusPalette` stories.
- Repurposed `CenteredLabels` story to `BottomStartLabels` (since `center` is
  now the default).
- Removed story decorator and redundant meta args (`aspectRatio`, `showLabels`,
  `showTooltip`) that duplicated component defaults.
- Updated Figma Code Connect status to COMPLETE and wired the canonical node URL.
