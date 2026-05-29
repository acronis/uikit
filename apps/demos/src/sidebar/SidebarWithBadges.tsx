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
  FileTextIcon,
  HomeFolderIcon,
  MailboxIcon,
} from '@acronis-platform/shadcn-uikit'
export function SidebarWithBadges() {
  return (
    <div className="h-[400px] border rounded-lg overflow-hidden flex">
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HomeFolderIcon />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <MailboxIcon />
                      <span>Messages</span>
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#243143]">
                        12
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <CalendarIcon />
                      <span>Events</span>
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#243143]">
                        3
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileTextIcon />
                      <span>Documents</span>
                      <span className="ml-auto rounded-full bg-[#DAE9AE] px-2 py-0 text-[10px] font-bold tracking-wider text-[#407009]">
                        NEW
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex items-center justify-center p-4 bg-background">
          <p className="text-sm text-muted-foreground">Main content area</p>
        </div>
      </SidebarProvider>
    </div>
  )
}
