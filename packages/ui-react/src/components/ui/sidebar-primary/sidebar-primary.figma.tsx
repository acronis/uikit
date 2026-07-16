// Figma Code Connect — status: COMPLETE
// Mapped to the "SidebarPrimary" component set in the shadcn-uikit Figma file
// (node 2092:4359). The set's single variant property `variant`
// (options: expanded | collapsed — confirmed via get_context_for_code_connect)
// maps to the React `expanded` boolean. The `sectionList` / `footerList` Figma
// slots are composed children in code (header logo + sections + footer).
//
// The Figma file also exposes Section (2322:80945), MenuItem (1937:2382), and
// MenuItemExtras (2463:49164) as standalone components with their own props —
// mapped below so each shows its own Dev Mode snippet, not just the assembly.
import figma from '@figma/code-connect';
import {
  BriefcaseIcon,
  CircleHelpIcon,
  MonitorIcon,
} from '@acronis-platform/icons-react/stroke-mono';

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
              <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />} selected>
                Assets
              </SidebarPrimaryMenuItem>
              <SidebarPrimaryMenuItem href="#" icon={<BriefcaseIcon />}>
                Clients
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimarySection>
        </SidebarPrimaryContent>
        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
              Help
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    ),
  }
);

// The "Section" sub-component (a group of menu items with an optional top
// divider). Its `firstSection` variant controls the divider/padding treatment
// in Figma, but the React part derives that from DOM position
// (`:not(:first-child)`, see anatomy.yaml) rather than a prop — every Section
// renders the same way regardless of position, so `firstSection` isn't mapped.
figma.connect(
  SidebarPrimarySection,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2322-80945',
  {
    example: () => (
      <SidebarPrimarySection>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />}>
            Label
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimarySection>
    ),
  }
);

// The "MenuItem" sub-component (one nav row). `variant` (unselected|selected)
// maps to the React `selected` boolean; `icon` is the leading instance-swap;
// `label` is the row text. `state` (idle|hover|active|focus) is pure CSS
// pseudo-state in code — not mapped, per anatomy.yaml. `hasExtras` toggles the
// trailing `MenuItemExtras` instance, which has its own Code Connect below.
figma.connect(
  SidebarPrimaryMenuItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1937-2382',
  {
    props: {
      selected: figma.enum('variant', {
        selected: true,
        unselected: false,
      }),
      icon: figma.instance('icon#2075:5'),
      label: figma.string('label#2075:10'),
    },
    example: ({ selected, icon, label }) => (
      <SidebarPrimaryMenuItem href="#" icon={icon} selected={selected}>
        {label}
      </SidebarPrimaryMenuItem>
    ),
  }
);

// The "MenuItemExtras" sub-component (the trailing affordance on a menu item).
// Its `variant` maps 1:1 to the React `variant`; `labelTag` / `labelShortcut` are
// the tag / shortcut text. Figma constrains the `tag` slot's Tag instance to
// `size="sm"` only (no `default` size option exists on this component) — the
// React `tag` prop must always be given a `<Tag size="sm">` (see the `tag` prop
// doc on `SidebarPrimaryMenuItemExtrasProps`).
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
