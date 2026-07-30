// Figma Code Connect — status: COMPLETE
// Mapped to the "ChatHeaderCollapsed" component in the ui-react Figma file
// (raw data-name "ChatHeaderCollapsedChatHeader/chat/collapsed").
//
// The nested Avatar > Icon layer is the icon slot's placeholder (Figma's
// generic SquareDashed slot marker, swapped per instance) — read via
// `figma.children('Icon')`, mirroring ChatMenuItem/ChatMenuItemCollapsed's own
// icon slots, since the component set defines no INSTANCE_SWAP directly on
// this node (it sits one level down, on the nested Avatar instance).
import figma from '@figma/code-connect';

import { ChatHeaderCollapsed } from './chat-header-collapsed';

figma.connect(
  ChatHeaderCollapsed,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-24771',
  {
    props: {
      icon: figma.children('Icon'),
    },
    example: ({ icon }) => <ChatHeaderCollapsed icon={icon} />,
  }
);
