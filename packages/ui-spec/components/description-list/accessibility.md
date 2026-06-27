# DescriptionList — accessibility

- Uses semantic `<dl>` / `<dt>` / `<dd>` (each item wraps the pair in a `<div>`,
  which HTML5 permits inside `<dl>`), so assistive tech reads label/value
  associations natively.
- Status is conveyed by an icon **and** text — never color alone. Keep the
  meaningful value/description as text; the icon is decorative reinforcement.
- Action links are real `Link`s (anchors/buttons) with accessible names; place
  them inside the relevant row's value so their context is clear.

## Contrast

Label and value use `--ui-text-on-surface-primary`; the value-description uses
`--ui-text-on-surface-secondary`; dividers use `--ui-border-on-surface-border` —
all meeting contrast in light and dark over the surface. Status icon colors come
from `--ui-text-on-status-*` (caller-applied) and meet non-text contrast.
