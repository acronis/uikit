// Figma Code Connect — status: COMPLETE
// Mapped to the "SidebarSecondary" component set in the shadcn-uikit Figma file
// (node 2468:59502). The set's single variant property `variant`
// (options: expanded | collapsed — confirmed via get_context_for_code_connect)
// maps to the React `expanded` boolean. The `sectionList` / `footerList` Figma
// slots are composed children in code; in collapsed mode the content is the
// CollapsedBreadcrumb (parent → ChevronRight → current page).
import figma from '@figma/code-connect';

import {
  SidebarSecondary,
  SidebarSecondaryCollapsedBreadcrumb,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondarySection,
} from './sidebar-secondary';

figma.connect(
  SidebarSecondary,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2468-59502',
  {
    props: {
      expanded: figma.enum('variant', {
        expanded: true,
        collapsed: false,
      }),
    },
    example: ({ expanded }) => (
      <SidebarSecondary expanded={expanded}>
        <SidebarSecondaryHeader label="Protection" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" selected>
                Dashboard
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuSub>
                <SidebarSecondaryMenuSubTrigger>
                  Policies
                </SidebarSecondaryMenuSubTrigger>
                <SidebarSecondaryMenuSubContent>
                  <SidebarSecondaryMenuSubItem href="#">
                    Backup
                  </SidebarSecondaryMenuSubItem>
                </SidebarSecondaryMenuSubContent>
              </SidebarSecondaryMenuSub>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryCollapsedBreadcrumb
          parentLabel="Protection"
          currentLabel="Dashboard"
        />
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    ),
  }
);
