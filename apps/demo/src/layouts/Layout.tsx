import { useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarHeader,
} from '@acronis-platform/shadcn-uikit/react'
import { ScrollArea } from '@acronis-platform/shadcn-uikit/react'
import { TokenSelector } from '@/components/playground/TokenSelector.tsx'
import { ThemeSwitcher } from '@/components/playground/ThemeSwitcher.tsx'
import { usePlaygroundStore } from '@/store/playground/playgroundStore.ts'
import { applyTokenSet } from '@/lib/playground/cssVariables.ts'
import { ThemeMode } from '@/types/playground/index.ts'

import {
  BellIcon,
  CalendarIcon,
  ChevronDownIcon,
  CircleIcon,
  FileTextIcon,
  ImageIcon,
  ListIcon,
  LockIcon,
  MailboxIcon,
  MessagesIcon,
  RotateIcon,
  TableIcon,
} from '@acronis-platform/shadcn-uikit'
import {
  AppWindowIcon,
  AwardIcon,
  BellRingIcon,
  BookmarkIcon,
  CalendarDaysIcon,
  CheckSquareIcon,
  ClipboardListIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LayoutIconIcon,
  LayoutTemplateIcon,
  MenuIcon,
  MinusIcon,
  MousePointerIcon,
  NavigationIcon,
  NetworkIcon,
  PaletteIcon,
  PanelTopIcon,
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SquareIcon,
  TagIcon,
  ToggleLeftIcon,
  TypeIcon,
} from '@/components/icons/missing-icons'
const navigationItems = [
  {
    title: 'Design System',
    items: [
      { id: 'design-tokens', title: 'Design Tokens', icon: PaletteIcon, path: '/design-tokens' },
      { id: 'icons', title: 'Icons', icon: ImageIcon, path: '/icons' },
    ],
  },
  {
    title: 'Components',
    items: [
      { id: 'alert', title: 'Alert', icon: BellIcon, path: '/alert' },
      { id: 'badge', title: 'Badge', icon: AwardIcon, path: '/badge' },
      { id: 'breadcrumb', title: 'Breadcrumb', icon: LayersIcon, path: '/breadcrumb' },
      { id: 'button', title: 'Button', icon: SquareIcon, path: '/button' },
      { id: 'button-group', title: 'Button Group', icon: SquareIcon, path: '/button-group' },
      { id: 'calendar', title: 'Calendar', icon: CalendarDaysIcon, path: '/calendar' },
      { id: 'carousel', title: 'Carousel', icon: RectangleHorizontalIcon, path: '/carousel' },
      { id: 'card', title: 'Card', icon: RectangleVerticalIcon, path: '/card' },
      { id: 'chart', title: 'Chart', icon: CheckSquareIcon, path: '/chart' },
      { id: 'checkbox', title: 'Checkbox', icon: CheckSquareIcon, path: '/checkbox' },
      { id: 'chip', title: 'Chip', icon: TagIcon, path: '/chip' },
      { id: 'combobox', title: 'Combobox', icon: ListIcon, path: '/combobox' },
      { id: 'container', title: 'Container', icon: ListIcon, path: '/container' },
      { id: 'datepicker', title: 'DatePicker', icon: CalendarIcon, path: '/datepicker' },
      { id: 'dialog', title: 'Dialog', icon: MessagesIcon, path: '/dialog' },
      { id: 'dropdown', title: 'Dropdown MenuIcon', icon: MenuIcon, path: '/dropdown-menu' },
      { id: 'empty', title: 'Empty State', icon: MailboxIcon, path: '/empty' },
      { id: 'filter', title: 'Filter', icon: LayersIcon, path: '/filter' },
      { id: 'form', title: 'Form', icon: ClipboardListIcon, path: '/form' },
      { id: 'input', title: 'Input', icon: TypeIcon, path: '/input' },
      {
        id: 'navigation-menu',
        title: 'NavigationIcon MenuIcon',
        icon: NavigationIcon,
        path: '/navigation-menu',
      },
      { id: 'pagination', title: 'Pagination', icon: LayoutGridIcon, path: '/pagination' },
      { id: 'password-input', title: 'Password Input', icon: LockIcon, path: '/password-input' },
      { id: 'secondary-menu', title: 'Secondary MenuIcon', icon: MenuIcon, path: '/secondary-menu' },
      { id: 'popover', title: 'Popover', icon: PanelTopIcon, path: '/popover' },
      { id: 'progress', title: 'Progress', icon: RotateIcon, path: '/progress' },
      { id: 'radio-group', title: 'Radio Group', icon: CircleIcon, path: '/radio-group' },
      { id: 'select', title: 'Select', icon: ChevronDownIcon, path: '/select' },
      { id: 'separator', title: 'Separator', icon: MinusIcon, path: '/separator' },
      { id: 'sidebar', title: 'Sidebar', icon: LayoutGridIcon, path: '/sidebar' },
      { id: 'sonner', title: 'Sonner (Toast)', icon: BellRingIcon, path: '/sonner' },
      { id: 'spinner', title: 'Spinner (Loading)', icon: RotateIcon, path: '/spinner' },
      { id: 'switch', title: 'Switch', icon: ToggleLeftIcon, path: '/switch' },
      { id: 'table', title: 'Table', icon: TableIcon, path: '/table' },
      { id: 'data-table', title: 'Data Table', icon: TableIcon, path: '/data-table' },
      { id: 'tabs', title: 'Tabs', icon: RectangleHorizontalIcon, path: '/tabs' },
      { id: 'tag', title: 'Tag', icon: BookmarkIcon, path: '/tag' },
      { id: 'textarea', title: 'Textarea', icon: FileTextIcon, path: '/textarea' },
      { id: 'tooltip', title: 'Tooltip', icon: MousePointerIcon, path: '/tooltip' },
      { id: 'tree', title: 'Tree', icon: NetworkIcon, path: '/tree' },
    ],
  },
  {
    title: 'Widgets',
    items: [
      { id: 'widgets', title: 'Dashboard Widgets', icon: LayoutDashboardIcon, path: '/widgets' },
    ],
  },
  {
    title: 'Layouts & Patterns',
    items: [
      { id: 'generic-components', title: 'Generic Components', icon: LayoutTemplateIcon, path: '/generic-components' },
      { id: 'layouts', title: 'Layouts', icon: LayoutIconIcon, path: '/layouts' },
      { id: 'patterns', title: 'Pattern Demos', icon: AppWindowIcon, path: '/patterns' },
    ],
  },
]

export function Layout() {
  const location = useLocation()
  const { theme, activeTokenSetId, tokenSets, customTokenSet } = usePlaygroundStore()

  useEffect(() => {
    const activeTokenSet = customTokenSet || tokenSets[activeTokenSetId]
    if (activeTokenSet) {
      const effectiveTheme =
        theme.mode === ThemeMode.SYSTEM
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? ThemeMode.DARK
            : ThemeMode.LIGHT
          : theme.mode
      applyTokenSet(activeTokenSet, effectiveTheme)
    }
  }, [theme, activeTokenSetId, tokenSets, customTokenSet])

  return (
    <SidebarProvider defaultOpen={true} className="h-screen overflow-hidden">
        <Sidebar collapsible="icon">
          <SidebarHeader className="h-16 shrink-0 border-b border-sidebar-border">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-3 h-full hover:bg-sidebar-accent/50 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                <LayoutDashboardIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Acronis UIKit</span>
                <span className="text-xs text-sidebar-foreground/70">
                  Component Library
                </span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <ScrollArea className="h-full">
              {navigationItems.map((section) => (
                <SidebarGroup key={section.title}>
                  <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-sidebar-foreground/70">
                    {section.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={location.pathname === item.path}
                            tooltip={item.title}
                          >
                            <Link to={item.path}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </ScrollArea>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background text-foreground px-6">
            <h1 className="text-xl font-semibold">Shadcn UIKit - React Demo</h1>
            <div className="flex items-center gap-3">
              <TokenSelector />
              <ThemeSwitcher showLabel />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
    </SidebarProvider>
  );
}
