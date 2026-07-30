# TagIcon

An icon-only tag: a 32px tinted rounded square holding a single 16px glyph. It
marks or categorizes something without spending horizontal space on a label.

## When to use

- A dense row or list where a glyph is enough to identify a kind, source, or
  channel, and a text label would not fit.
- Beside text that already names the thing, as a compact visual anchor.
- Anywhere the design shows the Figma `TagIcon` component (the 32px square under
  the Avatar frame).

## When not to use

- **You need a text label** — use `Tag`. TagIcon has no label slot, and the two
  are unrelated components: `Tag` owns the status palette (`--ui-tag-*`), a
  border, and two heights; TagIcon owns a fixed 32px square tinted from the
  Avatar palette. TagIcon is _not_ a `Tag` wrapper.
- **It should be clickable** — use `ButtonIcon`. TagIcon is presentational: no
  role, no tab stop, no activation.
- **It represents a person or entity** — use `Avatar` (a circle with an image or
  initials). TagIcon borrows the Avatar color tokens but is a square badge for a
  glyph, not an identity.
- **You just need a bare icon** — import it from
  `@acronis-platform/icons-react` directly; TagIcon adds the tinted container.

## Examples

```tsx
import { TagIcon } from '@acronis-platform/ui-react';
import { MessageTextIcon } from '@acronis-platform/icons-react/stroke-mono';

// Decorative — the meaning is in the adjacent text
<div className="flex items-center gap-2">
  <TagIcon icon={<MessageTextIcon />} />
  <span>Chat transcript</span>
</div>;

// Meaningful — the glyph is the only carrier, so label it
<TagIcon role="img" aria-label="Chat transcript" icon={<MessageTextIcon />} />;
```

## Parts

| Part   | Element | Notes                                                       |
| ------ | ------- | ----------------------------------------------------------- |
| root   | `span`  | 32px box, 8px radius, uniform 8px padding, tinted container |
| `icon` | `svg`   | The glyph, centered and constrained to 16px. Optional.      |

## Properties

| Prop    | Type        | Default    | Notes                                     |
| ------- | ----------- | ---------- | ----------------------------------------- |
| `color` | `'violet'`  | `'violet'` | Palette scheme (see the token note below) |
| `icon`  | `ReactNode` | —          | The glyph; backs Figma's `Icon` slot      |

Everything else is a standard `<span>` attribute (`className`, `aria-*`,
`role`, …) and is forwarded to the root.

## Color scheme coverage

The Figma component set declares **eight** `Color` variants — blue, violet, teal,
gray, red, orange, yellow, green. The Avatar token tier in
`@acronis-platform/tokens-pd` defines **five** (violet, teal, red, orange,
yellow) and has **no** blue, gray, or green. Only `violet` is shipped today.

Adding a scheme is additive and requires no new anatomy — but blue, gray, and
green are blocked until the design team ships
`components/Avatar/color/{blue,gray,green}` and the matching
`components/Avatar/label/color/*` variables. Never hand-author the missing
values; the same gap already caps `Avatar` at five schemes.
