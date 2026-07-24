# TrendIndicator — accessibility

- The direction glyph is **decorative** (`aria-hidden`) — meaning must exist in
  text, never in the icon or color alone.
- **Color is not the only differentiator.** The direction glyph and the visible
  value carry the meaning; sentiment color is reinforcement.
- **`ariaLabel`** sets a full, caller-authored sentence as the element's label
  via `role="img"` (e.g. "Revenue increased 12% compared with the previous
  quarter, a positive trend"). The kit can't build a correct localized sentence
  from `direction` + `value` alone, so it never synthesizes one.
- **Without `ariaLabel`**, assistive tech reads the visible `value` and
  `comparisonLabel` (both caller-supplied). Pass `ariaLabel` when the direction
  itself must be announced, since the glyph is hidden.
- A `flat` direction should be paired with a value/label like "Stable" or "No
  change" — a lone horizontal arrow is ambiguous to assistive tech.
- When a `tooltip` is set the trigger is focusable (`tabIndex={0}`), so the hint
  is reachable by keyboard, not hover only. The tooltip must not be the sole
  source of essential information.

## Contrast

Sentiment text/glyph colors resolve `--ui-text-on-status-*` tokens that meet text
contrast on the base surface in both themes; the badge tint pairs each with its
`--ui-background-status-*` background.
