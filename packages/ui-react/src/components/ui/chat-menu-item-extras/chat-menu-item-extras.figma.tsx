// Figma Code Connect — status: COMPLETE
// Mapped to the "ChatMenuItemExtras" component set in the ui-react Figma file
// (node 7329:52341). Property names and variant options confirmed via
// get_context_for_code_connect: `variant` (tag | externalLink | shortcut),
// `labelTag#2463:12`, `labelShortcut#2463:17`.
//
// The Figma set's third option, `externalLink`, is intentionally NOT mapped —
// the React component ships only the `tag` / `shortcut` variants (see the
// ui-spec README). Selecting `externalLink` in Dev Mode therefore yields no
// snippet rather than a misleading one; extend both the component and this
// enum together if that variant is brought into scope.
import figma from '@figma/code-connect';

import { ChatMenuItemExtras } from './chat-menu-item-extras';

figma.connect(
  ChatMenuItemExtras,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-52341',
  {
    props: {
      variant: figma.enum('variant', {
        tag: 'tag',
        shortcut: 'shortcut',
      }),
      labelTag: figma.string('labelTag'),
      labelShortcut: figma.string('labelShortcut'),
    },
    example: ({ variant, labelTag, labelShortcut }) => (
      <ChatMenuItemExtras
        variant={variant}
        labelTag={labelTag}
        labelShortcut={labelShortcut}
      />
    ),
  }
);
