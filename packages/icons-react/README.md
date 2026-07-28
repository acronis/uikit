# @acronis-platform/icons-react

React icon components, generated from
[`@acronis-platform/design-assets`](../design-assets). Tree-shakeable, themed
via `currentColor`, with the design-system size/stroke rules baked in.

## Install

```sh
pnpm add @acronis-platform/icons-react react react-dom
```

## Usage

```tsx
import {
  BoltIcon,
  ChevronDownIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function Example() {
  return (
    <p style={{ color: 'crimson' }}>
      {/* inherits text color via currentColor */}
      <BoltIcon size={16} title="Power" />
      <ChevronDownIcon /> {/* defaults to 24px, decorative */}
    </p>
  );
}
```

`size` is the strict, generated dimension axis design-assets defines for the
pack (today `16 | 24`, default `24`) — each dimension carries its own
design-resolved artwork and stroke width. Only the dimensions design defines are
allowed; size a different box with CSS.

### Dynamic lookup

```tsx
import {
  icons,
  type IconName,
} from '@acronis-platform/icons-react/stroke-mono';

const Icon = icons['chevron-down'];
```

(Importing `icons` pulls the whole pack; prefer named imports for bundle size.)

## Develop

```sh
pnpm --filter @acronis-platform/icons-react generate    # regenerate from design-assets
pnpm --filter @acronis-platform/icons-react storybook    # browse the gallery
pnpm --filter @acronis-platform/icons-react test         # Vitest + RTL
pnpm --filter @acronis-platform/icons-react build        # generate + lib bundle
```

Generated components live under `src/packs/` and are **not** committed — see
[`AGENTS.md`](./AGENTS.md).
