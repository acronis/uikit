---
'@acronis-platform/ui-react': minor
---

Add `ChartState` — a shared loading / empty / error placeholder for the chart types, rendered in place of a chart inside the same sized slot. A compact status block: a leading glyph (the shared `Spinner` / `InboxIcon` / `CircleWarningIcon`) over a centered label, with an optional retry `action` for the error state and a per-state `message` override. Ported from the Figma InputSelect dropdown states and kept visually in step with the shipped `InputSelectStatus`; themes from existing semantic `--ui-*` tokens (no `--ui-chart-*` tier yet).
