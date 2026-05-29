import React from 'react'
import { SunIcon, MoonIcon, MonitorIcon } from '@/components/icons/missing-icons'
import { usePlaygroundStore } from '@/store/playground/playgroundStore.ts'
import { ThemeMode } from '@/types/playground/index.ts'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@acronis-platform/shadcn-uikit/react'

interface ThemeSwitcherProps {
  variant?: 'button' | 'dropdown'
  size?: 'sm' | 'default' | 'lg'
  showLabel?: boolean
  className?: string
  onThemeChange?: (theme: ThemeMode) => void
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'dropdown',
  size = 'default',
  showLabel = false,
  className = '',
  onThemeChange,
}) => {
  const { theme, setTheme } = usePlaygroundStore()

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode)
    onThemeChange?.(mode)
  }

  const getIcon = () => {
    switch (theme.mode) {
      case ThemeMode.LIGHT:
        return <SunIcon className="h-5 w-5" />
      case ThemeMode.DARK:
        return <MoonIcon className="h-5 w-5" />
      case ThemeMode.SYSTEM:
        return <MonitorIcon className="h-5 w-5" />
    }
  }

  const getLabel = () => {
    switch (theme.mode) {
      case ThemeMode.LIGHT:
        return 'Light'
      case ThemeMode.DARK:
        return 'Dark'
      case ThemeMode.SYSTEM:
        return 'System'
    }
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={() => {
          const nextMode =
            theme.mode === ThemeMode.LIGHT
              ? ThemeMode.DARK
              : theme.mode === ThemeMode.DARK
                ? ThemeMode.SYSTEM
                : ThemeMode.LIGHT
          handleThemeChange(nextMode)
        }}
        className={className}
        aria-label="Toggle theme"
      >
        {getIcon()}
        {showLabel && <span className="ml-2">{getLabel()}</span>}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size={size} className={className} aria-label="Select theme" />}>
        {getIcon()}
        {showLabel && <span className="ml-2">{getLabel()}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleThemeChange(ThemeMode.LIGHT)}
          className="cursor-pointer"
        >
          <SunIcon className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange(ThemeMode.DARK)}
          className="cursor-pointer"
        >
          <MoonIcon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange(ThemeMode.SYSTEM)}
          className="cursor-pointer"
        >
          <MonitorIcon className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
