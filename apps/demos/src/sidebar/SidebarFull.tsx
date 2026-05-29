import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@acronis-platform/shadcn-uikit/react'
import {
  CalendarIcon,
  ChevronRightIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeFolderIcon,
  MailboxIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from '@acronis-platform/shadcn-uikit'
import { BarChartIcon } from '../icons/missing-icons'
export function SidebarFull() {
  const [activeItem, setActiveItem] = useState('home')

  const mainNavItems = [
    { id: 'home', title: 'Home', icon: HomeFolderIcon },
    { id: 'inbox', title: 'Inbox', icon: MailboxIcon, badge: '7' },
    { id: 'calendar', title: 'Calendar', icon: CalendarIcon },
    { id: 'search', title: 'Search', icon: SearchIcon },
    { id: 'settings', title: 'Settings', icon: SettingsIcon },
  ]

  const projectNavItems = [
    {
      id: 'projects',
      title: 'Projects',
      icon: FileTextIcon,
      subItems: [
        { id: 'project-1', title: 'Project Alpha' },
        { id: 'project-2', title: 'Project Beta' },
        { id: 'project-3', title: 'Project Gamma' },
      ],
    },
    {
      id: 'team',
      title: 'Team',
      icon: UsersIcon,
      subItems: [
        { id: 'team-members', title: 'Members' },
        { id: 'team-roles', title: 'Roles' },
        { id: 'team-permissions', title: 'Permissions' },
      ],
    },
  ]

  const analyticsNavItems = [
    { id: 'analytics', title: 'Analytics', icon: BarChartIcon },
    { id: 'reports', title: 'Reports', icon: FileTextIcon },
    { id: 'security', title: 'Security', icon: ShieldIcon, tag: 'NEW' },
  ]

  return (
    <div className="h-[600px] border rounded-lg overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <Sidebar collapsible="none">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                <HomeFolderIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Acronis UIKit</span>
                <span className="text-xs text-sidebar-foreground/70">Demo Application</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeItem === item.id}
                        onClick={() => setActiveItem(item.id)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#243143]">
                            {item.badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/70">
                Workspace
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projectNavItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeItem === item.id}
                        onClick={() => setActiveItem(item.id)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRightIcon className="ml-auto h-4 w-4" />
                      </SidebarMenuButton>
                      {item.subItems && (
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton
                                isActive={activeItem === subItem.id}
                                onClick={() => setActiveItem(subItem.id)}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/70">
                Insights
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {analyticsNavItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeItem === item.id}
                        onClick={() => setActiveItem(item.id)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        {item.tag && (
                          <span className="ml-auto rounded-full bg-[#DAE9AE] px-2 py-0 text-[10px] font-bold tracking-wider text-[#407009]">
                            {item.tag}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <UserIcon />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <HelpCircleIcon />
                  <span>Help & Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">
                {mainNavItems.find((item) => item.id === activeItem)?.title ||
                  projectNavItems
                    .flatMap((item) => item.subItems || [])
                    .find((item) => item.id === activeItem)?.title ||
                  analyticsNavItems.find((item) => item.id === activeItem)?.title ||
                  'Dashboard'}
              </h1>
            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="h-[200px] rounded-xl bg-muted/50" />
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
