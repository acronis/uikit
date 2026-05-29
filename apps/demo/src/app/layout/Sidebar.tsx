import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  TableIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatIcon,
} from '@acronis-platform/shadcn-uikit';
import { LayoutDashboardIcon } from '@/components/icons/missing-icons'
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Separator } from '@acronis-platform/shadcn-uikit/react'
import { useLocale } from '../context/LocaleContext'

interface SidebarProps {
  isCollapsed: boolean
  onCollapse: (collapsed: boolean) => void
  className?: string
}

interface NavItem {
  titleKey: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    titleKey: 'navigation.dashboard',
    href: 'dashboard',
    icon: LayoutDashboardIcon,
  },
  { titleKey: 'navigation.data', href: 'data', icon: TableIcon },
  { titleKey: 'navigation.chat', href: 'chat', icon: ChatIcon },
  { titleKey: 'navigation.settings', href: 'settings', icon: SettingsIcon },
];

export function Sidebar({ isCollapsed, onCollapse, className }: SidebarProps) {
  const { t } = useLocale()
  const location = useLocation()

  return (
    <aside
      className={cn(
        'border-r bg-background transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <span className="font-semibold text-lg">Demo App</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapse(!isCollapsed)}
          className={cn(isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                isCollapsed && 'justify-center'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{t(item.titleKey)}</span>}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="p-4">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground">
            <p>shadcn UI Kit Demo</p>
            <p className="mt-1">v0.1.0</p>
          </div>
        )}
      </div>
    </aside>
  )
}
