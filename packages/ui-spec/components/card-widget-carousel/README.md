# CardWidgetCarousel

A horizontal scroll carousel that holds a row of AI action-widget cards and
provides floating Previous/Next chevron buttons to navigate the view.

## When to use

- Displaying three or more AI-generated action cards in a constrained horizontal
  space (e.g. a dashboard widget row) where all cards cannot be visible at once.
- Any context where a horizontal scroll rail with progressive disclosure (one
  click = one card step) is the intended interaction.

## When not to use

- Full-page media galleries or image sliders — use a dedicated media carousel.
- Fewer than two cards that all fit in the available width — a plain flex row
  without navigation buttons is simpler.

## Parts

| Part          | Description                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `track`       | Horizontally scrollable flex row. Pass cards as direct children.                                                                                                                            |
| `prev-button` | Circular 48 × 48 px `<button>` overlaid at the leading edge. Retreats the track by one card (288 px) + one gap (16 px). Disabled and invisible (`aria-disabled`, `opacity-0`) at the start. |
| `next-button` | Circular 48 × 48 px `<button>` overlaid at the trailing edge. Advances the track by one card (288 px) + one gap (16 px). Disabled and invisible at the end.                                 |

## Usage

```tsx
import { CardWidgetCarousel, CardWidget } from '@acronis-platform/ui-react';

<CardWidgetCarousel nextLabel="Next" prevLabel="Previous">
  <CardWidget
    header="Phishing attacks"
    status="danger"
    icon={<WarningIcon size={16} />}
    title="Phishing attack detected"
    metric="$15K"
    caption="Projected new MRR"
    footer={<Button variant="ghost">Review</Button>}
  />
  <CardWidget header="Loading…" status="info" skeleton />
</CardWidgetCarousel>;
```

## Companion: CardWidget

`CardWidget` is the companion card exported from the same barrel. It composes
`Card` + `CardHeader` + `CardContent` + `CardFooter`, fixing its width at
288 px, and adds:

- **Status-colored icon box** — driven by the `status` prop (`'danger'`,
  `'warning'`, `'info'`), using `--ui-background-status-*` and
  `--ui-glyph-on-status-*` tokens.
- **Skeleton loading** — pass `skeleton` to show animated placeholder lines
  instead of body content. Bars inherit the status color.
- **Flexible footer** — pass any `ReactNode` via `footer` (action buttons,
  CTAs). Omit to hide the footer entirely.

### CardWidget props

| Prop           | Type                              | Default     | Description                                         |
| -------------- | --------------------------------- | ----------- | --------------------------------------------------- |
| `status`       | `'danger' \| 'warning' \| 'info'` | `'info'`    | Semantic status — drives the icon-box colors.       |
| `icon`         | `ReactNode`                       | —           | 16 px icon inside the status-colored box.           |
| `header`       | `string`                          | —           | Card header title.                                  |
| `title`        | `string`                          | —           | Insight title (14 px, semibold).                    |
| `description`  | `string`                          | —           | Supporting text (12 px).                            |
| `metric`       | `ReactNode`                       | —           | Primary value (24 px, semibold).                    |
| `caption`      | `string`                          | —           | Small caption beside the metric (12 px).            |
| `skeleton`     | `boolean`                         | `false`     | Animated placeholder lines instead of body content. |
| `loadingLabel` | `string`                          | `'Loading'` | `aria-label` for the skeleton loading indicator.    |
| `footer`       | `ReactNode`                       | —           | Action buttons in the card footer.                  |

## Child card sizing

Each child card should be **288 px wide** (`w-72`) and `shrink-0` so the
scroll step (304 px) aligns to exactly one card width. `CardWidget` enforces
this by default.

## RTL

Both chevron icons flip (`rtl:rotate-180`) and the scroll direction reverses
automatically when an ancestor has `dir="rtl"`.

## Localization

The `nextLabel` (default `'Next'`) and `prevLabel` (default `'Previous'`) props
are `aria-label` values on the navigation buttons. Override them when deploying
in a non-English context.
