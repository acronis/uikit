// Figma Code Connect — status: COMPLETE
// Mapped to the "ChatMenuItemCollapsed" component set in the ui-react Figma file.
//
// The set declares `hasAlert` (BOOLEAN) and `variant` (VARIANT: idle / hover /
// active / focused). Only `idle` is mapped — the other three are interaction
// states the component paints with `hover:` / `active:` / `focus-visible:`, not
// API values, so they resolve to `undefined` and fall back to the default.
//
// The nested `SquareDashed` layer is the icon slot's placeholder: a plain nested
// instance, since the set defines no INSTANCE_SWAP property — so it is read with
// `figma.children`, not `figma.instance`. The `DotRed` layer is not mapped: its
// visibility is already bound to the `hasAlert` property, which the component
// renders itself.
import figma from '@figma/code-connect';

import { ChatMenuItemCollapsed } from './chat-menu-item-collapsed';

figma.connect(
  ChatMenuItemCollapsed,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-25084',
  {
    props: {
      variant: figma.enum('variant', {
        idle: 'idle',
      }),
      hasAlert: figma.boolean('hasAlert'),
      icon: figma.children('SquareDashed'),
    },
    example: ({ variant, hasAlert, icon }) => (
      <ChatMenuItemCollapsed
        aria-label="Chats"
        variant={variant}
        hasAlert={hasAlert}
        icon={icon}
      />
    ),
  }
);
