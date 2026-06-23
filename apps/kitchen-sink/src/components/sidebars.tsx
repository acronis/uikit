import {
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
  SidebarSecondary,
  SidebarSecondaryCollapseTrigger,
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
  SidebarSecondarySectionLabel,
} from '@acronis-platform/ui-react';
import {
  BoxIcon,
  CircleHelpIcon,
  LayoutGridIcon,
  PanelLeftIcon,
  PlusIcon,
  ServerIcon,
  UsersIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { SpecimenPage, Subsection } from '@/lib/specimen';

export function SidebarsSpecimen() {
  return (
    <SpecimenPage
      title="Sidebars"
      description="The primary (icon rail) and secondary (labeled tree) navigation sidebars. Menu items carry idle / hover / selected treatments; the selected item is shown active below."
    >
      <Subsection title="Primary & secondary">
        {/* Sidebars fill their container height; bound them to a fixed shell. */}
        <div style={{ display: 'flex', gap: 16, height: 460 }}>
          <SidebarPrimary>
            <SidebarPrimaryHeader>
              <PlusIcon />
            </SidebarPrimaryHeader>
            <SidebarPrimaryContent>
              <SidebarPrimarySection>
                <SidebarPrimaryMenu>
                  <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
                    Assets
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<ServerIcon />}>
                    Protection
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
                    Clients
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<LayoutGridIcon />}>
                    Automation
                  </SidebarPrimaryMenuItem>
                </SidebarPrimaryMenu>
              </SidebarPrimarySection>
            </SidebarPrimaryContent>
            <SidebarPrimaryFooter>
              <SidebarPrimaryMenu>
                <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
                  Help
                </SidebarPrimaryMenuItem>
                <SidebarPrimaryCollapseTrigger icon={<PanelLeftIcon />}>
                  Collapse menu
                </SidebarPrimaryCollapseTrigger>
              </SidebarPrimaryMenu>
            </SidebarPrimaryFooter>
          </SidebarPrimary>

          <SidebarSecondary>
            <SidebarSecondaryHeader label="Protection" />
            <SidebarSecondaryContent>
              <SidebarSecondarySection>
                <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
                <SidebarSecondaryMenu>
                  <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
                    Dashboard
                  </SidebarSecondaryMenuItem>
                  <SidebarSecondaryMenuItem href="#" icon={<ServerIcon />}>
                    Devices
                  </SidebarSecondaryMenuItem>
                </SidebarSecondaryMenu>
              </SidebarSecondarySection>
              <SidebarSecondarySection>
                <SidebarSecondarySectionLabel>Configuration</SidebarSecondarySectionLabel>
                <SidebarSecondaryMenu>
                  <SidebarSecondaryMenuSub defaultOpen>
                    <SidebarSecondaryMenuSubTrigger icon={<BoxIcon />}>
                      Policies
                    </SidebarSecondaryMenuSubTrigger>
                    <SidebarSecondaryMenuSubContent>
                      <SidebarSecondaryMenuSubItem href="#" selected>
                        Backup
                      </SidebarSecondaryMenuSubItem>
                      <SidebarSecondaryMenuSubItem href="#">
                        Antivirus
                      </SidebarSecondaryMenuSubItem>
                    </SidebarSecondaryMenuSubContent>
                  </SidebarSecondaryMenuSub>
                </SidebarSecondaryMenu>
              </SidebarSecondarySection>
            </SidebarSecondaryContent>
            <SidebarSecondaryFooter>
              <SidebarSecondaryMenu>
                <SidebarSecondaryCollapseTrigger icon={<PanelLeftIcon />}>
                  Collapse menu
                </SidebarSecondaryCollapseTrigger>
              </SidebarSecondaryMenu>
            </SidebarSecondaryFooter>
          </SidebarSecondary>
        </div>
      </Subsection>
    </SpecimenPage>
  );
}
