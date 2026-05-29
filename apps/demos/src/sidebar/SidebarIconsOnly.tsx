import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@acronis-platform/shadcn-uikit/react'
import {
  CalendarIcon,
  HomeFolderIcon,
  MailboxIcon,
  SettingsIcon,
} from '@acronis-platform/shadcn-uikit'
export function SidebarIconsOnly() {
  return (
    <div className="h-[400px] border rounded-lg overflow-hidden flex">
      <SidebarProvider defaultOpen={true}>
        <Sidebar collapsible="none" className="w-16">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Home" className="justify-center">
                      <HomeFolderIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Inbox" className="justify-center">
                      <MailboxIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Calendar" className="justify-center">
                      <CalendarIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings" className="justify-center">
                      <SettingsIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex items-center justify-center p-4 bg-background">
          <p className="text-sm text-muted-foreground">Icon-only sidebar view</p>
        </div>
      </SidebarProvider>
    </div>
  )
}
