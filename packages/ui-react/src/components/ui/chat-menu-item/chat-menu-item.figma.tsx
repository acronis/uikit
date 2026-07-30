// Figma Code Connect — status: COMPLETE
// Mapped to the "ChatMenuItem" component set in the ui-react Figma file.
//
// The set declares `hasExtras` (BOOLEAN) and `state` (VARIANT: idle / hover /
// active / focused). Only `idle` and `active` are mapped as real prop values;
// `hover` and `focused` are interaction states the component paints with
// `hover:` / `focus-visible:`, so they resolve to `undefined` and fall back
// to the default.
//
// The nested `SquareDashed` layer is the icon slot's placeholder: a plain
// nested instance, since the set defines no INSTANCE_SWAP property — read
// with `figma.children`, not `figma.instance`. The nested `ChatMenuItemExtras`
// instance is visibility-bound to `hasExtras`; its own `labelTag` /
// `labelShortcut` / `variant` properties are out of scope here (composed by
// the consumer through `extras`, not flattened onto this mapping).
import figma from '@figma/code-connect';

import { ChatMenuItem } from './chat-menu-item';

figma.connect(
  ChatMenuItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6516-2333',
  {
    props: {
      state: figma.enum('state', {
        idle: 'idle',
        active: 'active',
      }),
      hasExtras: figma.boolean('hasExtras'),
      icon: figma.children('SquareDashed'),
    },
    example: ({ state, hasExtras, icon }) => (
      <ChatMenuItem
        label="Menu item"
        state={state}
        hasExtras={hasExtras}
        icon={icon}
      />
    ),
  }
);
