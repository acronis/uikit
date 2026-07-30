// Figma Code Connect — status: COMPLETE
// Mapped to the "AI-Chat" component set in the ui-react Figma file (node
// 7329:24933). Property names verified via get_context_for_code_connect:
// `variant` (VARIANT, options expanded | collapsed | full-width) and `Feed`
// (SLOT, key Feed#7461:3) — the ONLY two properties this component exposes.
//
// Every other piece of content visible inside the instance — the header tab
// set ("Acronis AI" / "Tasks"), the chat-history list ("New chat"), the
// per-conversation title ("Chat name"), and the footer/menu variant-switch
// actions (Maximize/Minimize/Collapse chat) — is NOT bound to a component
// property in Figma either; it is fixed content baked into this specific
// composition, which is exactly what `AiChat`'s implementation renders.
import figma from '@figma/code-connect';

import { AiChat } from './ai-chat';

figma.connect(
  AiChat,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-24933',
  {
    props: {
      variant: figma.enum('variant', {
        collapsed: 'collapsed',
        expanded: 'expanded',
        'full-width': 'full-width',
      }),
      children: figma.children('Feed'),
    },
    example: ({ variant, children }) => (
      <AiChat variant={variant}>{children}</AiChat>
    ),
  }
);
