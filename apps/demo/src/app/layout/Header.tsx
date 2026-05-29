import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { UserIcon, BurgerMenuIcon } from '@acronis-platform/shadcn-uikit'
import { MoonIcon, SunIcon, LogOutIcon } from '@/components/icons/missing-icons'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Avatar, AvatarFallback, AvatarImage } from '@acronis-platform/shadcn-uikit/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@acronis-platform/shadcn-uikit/react'
import { useAuth } from '../hooks/useAuth'
import { LanguageSelector } from '../components/LanguageSelector'

interface HeaderProps {
  onMenuToggle?: () => void
  showMenuButton?: boolean
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  chat: 'Chat',
  data: 'Data Table',
  settings: 'Settings',
}

export function Header({ onMenuToggle, showMenuButton = true }: HeaderProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentRoute = pathSegments[pathSegments.length - 1]
  const breadcrumbLabel = routeLabels[currentRoute] || currentRoute

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <BurgerMenuIcon className="h-5 w-5" />
          </Button>
        )}

        <div className="flex-1">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>App</span>
            <span>/</span>
            <span className="text-foreground font-medium">{breadcrumbLabel}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </Button>

          <LanguageSelector />

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full" />}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
