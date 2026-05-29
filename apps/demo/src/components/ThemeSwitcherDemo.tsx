import { useState, useEffect } from 'react'
import {
  applyTheme,
  getCurrentTheme,
  // applyColorMode,
  getCurrentColorMode,
  toggleColorMode,
  type ThemeName,
} from '@acronis-platform/shadcn-uikit'

export function ThemeSwitcherDemo() {
  const [theme, setTheme] = useState<ThemeName>('acronis-default')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const current = getCurrentTheme()
    if (current) setTheme(current)
    setIsDark(getCurrentColorMode() === 'dark')
  }, [])

  const handleThemeChange = (newTheme: ThemeName) => {
    applyTheme(newTheme)
    setTheme(newTheme)
  }

  const handleToggleDarkMode = () => {
    const newMode = toggleColorMode()
    setIsDark(newMode === 'dark')
  }

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div>
        <h2 className="text-2xl font-bold mb-4">Theme Switcher Demo</h2>
        <p className="text-muted-foreground mb-4">
          Try switching between different themes and color modes to see the changes in real-time.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value as ThemeName)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="acronis-default">Acronis Default</option>
            <option value="acronis-ocean">Acronis Ocean</option>
            <option value="purple">White Label — Purple</option>
            <option value="ingram-micro">White Label — Ingram Micro</option>
            <option value="telstra">White Label — Telstra</option>
            <option value="dark-gray">White Label — Dark Gray</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Color Mode</label>
          <button
            onClick={handleToggleDarkMode}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <h3 className="font-semibold">Color Preview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-primary text-primary-foreground rounded">Primary</div>
          <div className="p-3 bg-secondary text-secondary-foreground rounded">Secondary</div>
          <div className="p-3 bg-accent text-accent-foreground rounded">Accent</div>
          <div className="p-3 bg-muted text-muted-foreground rounded">Muted</div>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <h3 className="font-semibold">Status Colors</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-success text-success-foreground rounded">Success</div>
          <div className="p-2 bg-warning text-warning-foreground rounded">Warning</div>
          <div className="p-2 bg-danger text-danger-foreground rounded">Danger</div>
          <div className="p-2 bg-info text-info-foreground rounded">Info</div>
        </div>
      </div>
    </div>
  )
}
