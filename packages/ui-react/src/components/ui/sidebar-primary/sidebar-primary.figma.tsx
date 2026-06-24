// Figma Code Connect — status: COMPLETE
// Mapped to the "SidebarPrimary" component set in the shadcn-uikit Figma file
// (node 2092:4359). The set's single variant property `variant`
// (options: expanded | collapsed — confirmed via get_context_for_code_connect)
// maps to the React `expanded` boolean. The `sectionList` / `footerList` Figma
// slots are composed children in code (header logo + sections + footer).
import figma from '@figma/code-connect';

import {
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimarySection,
} from './sidebar-primary';

figma.connect(
  SidebarPrimary,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2092-4359',
  {
    props: {
      expanded: figma.enum('variant', {
        expanded: true,
        collapsed: false,
      }),
    },
    example: ({ expanded }) => (
      <SidebarPrimary expanded={expanded}>
        <SidebarPrimaryHeader>{/* consumer logo */}</SidebarPrimaryHeader>
        <SidebarPrimaryContent>
          <SidebarPrimarySection>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="#" selected>
                Assets
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#">Clients</SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#">Help</SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    ),
  }
);

// The "MenuItemExtras" sub-component (the trailing affordance on a menu item).
// Its `variant` maps 1:1 to the React `variant`; `labelTag` / `labelShortcut` are
// the tag / shortcut text.
figma.connect(
  SidebarPrimaryMenuItemExtras,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2463-49164',
  {
    props: {
      variant: figma.enum('variant', {
        tag: 'tag',
        externalLink: 'externalLink',
        shortcut: 'shortcut',
        'tag-externalLink': 'tag-externalLink',
      }),
      tag: figma.string('labelTag'),
      shortcut: figma.string('labelShortcut'),
    },
    example: ({ variant, tag, shortcut }) => (
      <SidebarPrimaryMenuItemExtras variant={variant} tag={tag} shortcut={shortcut} />
    ),
  }
);
