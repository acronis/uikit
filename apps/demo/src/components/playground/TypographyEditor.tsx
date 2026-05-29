import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from '@acronis-platform/shadcn-uikit/react'
import { RotateIcon } from '@acronis-platform/shadcn-uikit'
import { applyTypographySettings, TypographySettings } from '@/lib/playground/cssVariables'

const FONT_FAMILIES = [
  { value: 'system-ui', label: 'System UI', stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { value: 'inter', label: 'Inter', stack: 'Inter, system-ui, sans-serif' },
  { value: 'roboto', label: 'Roboto', stack: 'Roboto, system-ui, sans-serif' },
  { value: 'open-sans', label: 'Open Sans', stack: '"Open Sans", system-ui, sans-serif' },
  { value: 'lato', label: 'Lato', stack: 'Lato, system-ui, sans-serif' },
  { value: 'montserrat', label: 'Montserrat', stack: 'Montserrat, system-ui, sans-serif' },
  { value: 'poppins', label: 'Poppins', stack: 'Poppins, system-ui, sans-serif' },
  { value: 'source-sans', label: 'Source Sans Pro', stack: '"Source Sans Pro", system-ui, sans-serif' },
  { value: 'arial', label: 'Arial', stack: 'Arial, Helvetica, sans-serif' },
  { value: 'helvetica', label: 'Helvetica', stack: 'Helvetica, Arial, sans-serif' },
  { value: 'georgia', label: 'Georgia', stack: 'Georgia, "Times New Roman", serif' },
  { value: 'times', label: 'Times New Roman', stack: '"Times New Roman", Times, serif' },
  { value: 'courier', label: 'Courier New', stack: '"Courier New", Courier, monospace' },
  { value: 'monaco', label: 'Monaco', stack: 'Monaco, "Courier New", monospace' },
  { value: 'fira-code', label: 'Fira Code', stack: '"Fira Code", Monaco, monospace' },
  { value: 'jetbrains-mono', label: 'JetBrains Mono', stack: '"JetBrains Mono", Monaco, monospace' },
]

const FONT_SIZES = [
  { value: '12px', label: 'Extra Small (12px)' },
  { value: '14px', label: 'Small (14px)' },
  { value: '16px', label: 'Base (16px)' },
  { value: '18px', label: 'Large (18px)' },
  { value: '20px', label: 'Extra Large (20px)' },
]

const LINE_HEIGHTS = [
  { value: '1.2', label: 'Tight (1.2)' },
  { value: '1.4', label: 'Snug (1.4)' },
  { value: '1.5', label: 'Normal (1.5)' },
  { value: '1.6', label: 'Relaxed (1.6)' },
  { value: '1.8', label: 'Loose (1.8)' },
  { value: '2', label: 'Extra Loose (2)' },
]

const LETTER_SPACINGS = [
  { value: '-0.05em', label: 'Tighter (-0.05em)' },
  { value: '-0.025em', label: 'Tight (-0.025em)' },
  { value: '0', label: 'Normal (0)' },
  { value: '0.025em', label: 'Wide (0.025em)' },
  { value: '0.05em', label: 'Wider (0.05em)' },
  { value: '0.1em', label: 'Widest (0.1em)' },
]

const DEFAULT_SETTINGS: TypographySettings = {
  fontFamily: 'system-ui',
  fontFamilyStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '16px',
  lineHeight: '1.5',
  letterSpacing: '0',
}

export const TypographyEditor: React.FC = () => {
  const [settings, setSettings] = useState<TypographySettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('playground-typography')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return DEFAULT_SETTINGS
        }
      }
    }
    return DEFAULT_SETTINGS
  })

  useEffect(() => {
    applyTypographySettings(settings)
    localStorage.setItem('playground-typography', JSON.stringify(settings))
  }, [settings])

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const isCustom = JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Typography Settings</h3>
          <p className="text-sm text-muted-foreground">
            {isCustom ? 'Custom typography settings applied' : 'Using default typography'}
          </p>
        </div>
        {isCustom && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateIcon className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Font Family</label>
          <Select
            value={settings.fontFamily}
            onValueChange={(value) => {
              const selectedFont = FONT_FAMILIES.find(f => f.value === value)
              if (selectedFont) {
                setSettings({ 
                  ...settings, 
                  fontFamily: value,
                  fontFamilyStack: selectedFont.stack
                })
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose the primary font family for the interface
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Base Font Size</label>
          <Select
            value={settings.fontSize}
            onValueChange={(value) => setSettings({ ...settings, fontSize: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Base font size affects all text elements
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Line Height</label>
          <Select
            value={settings.lineHeight}
            onValueChange={(value) => setSettings({ ...settings, lineHeight: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LINE_HEIGHTS.map((height) => (
                <SelectItem key={height.value} value={height.value}>
                  {height.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Controls spacing between lines of text
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Letter Spacing</label>
          <Select
            value={settings.letterSpacing}
            onValueChange={(value) => setSettings({ ...settings, letterSpacing: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LETTER_SPACINGS.map((spacing) => (
                <SelectItem key={spacing.value} value={spacing.value}>
                  {spacing.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Adjusts spacing between characters
          </p>
        </div>

        <div className="mt-6 p-4 border border-border rounded-lg bg-card">
          <p className="text-sm font-medium mb-2">Preview</p>
          <div className="space-y-2">
            <p className="text-2xl font-bold">The quick brown fox</p>
            <p className="text-base">
              The quick brown fox jumps over the lazy dog. This is a preview of how your text will look with the selected typography settings.
            </p>
            <p className="text-sm text-muted-foreground">
              Small text example for detailed content
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
