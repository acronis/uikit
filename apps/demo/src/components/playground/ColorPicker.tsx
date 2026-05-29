import { HslColorPicker } from 'react-colorful'
import { ColorToken } from '@/types/playground'
import { createColorToken, createColorTokenFromOklch } from '@/lib/playground/colorUtils'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Label } from '@acronis-platform/shadcn-uikit/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'

interface ColorPickerProps {
  color: ColorToken
  onChange: (color: ColorToken) => void
  label?: string
  className?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label,
  className = '',
}) => {
  const handleHslChange = (hsl: { h: number; s: number; l: number }) => {
    onChange(createColorToken(hsl.h, hsl.s, hsl.l))
  }

  const handleHexChange = (hex: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return

    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    onChange(
      createColorToken(Math.round(h * 360), Math.round(s * 100), Math.round(l * 100))
    )
  }

  const handleInputChange = (field: 'h' | 's' | 'l', value: string) => {
    const numValue = parseInt(value)
    if (isNaN(numValue)) return

    const newColor = { ...color }
    if (field === 'h') {
      newColor.h = Math.max(0, Math.min(360, numValue))
    } else {
      newColor[field] = Math.max(0, Math.min(100, numValue))
    }

    onChange(createColorToken(newColor.h, newColor.s, newColor.l))
  }

  const handleOklchInputChange = (field: 'l' | 'c' | 'h', value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    // Get current OKLCH values or compute from HSL
    const currentOklch = color.oklch || createColorToken(color.h, color.s, color.l).oklch
    if (!currentOklch) return

    const newOklch = { ...currentOklch }
    if (field === 'l') {
      newOklch.l = Math.max(0, Math.min(1, numValue))
    } else if (field === 'c') {
      newOklch.c = Math.max(0, Math.min(0.4, numValue))
    } else {
      newOklch.h = Math.max(0, Math.min(360, numValue))
    }

    onChange(createColorTokenFromOklch(newOklch.l, newOklch.c, newOklch.h))
  }

  // Ensure we always have OKLCH values to display
  const displayOklch = color.oklch || createColorToken(color.h, color.s, color.l).oklch

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="space-y-4">
        <HslColorPicker
          color={{ h: color.h, s: color.s, l: color.l }}
          onChange={handleHslChange}
          className="!w-full"
        />

        <Tabs defaultValue="hsl" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hsl">HSL</TabsTrigger>
            <TabsTrigger value="oklch">OKLCH</TabsTrigger>
          </TabsList>

          <TabsContent value="hsl" className="space-y-3 mt-3">
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label htmlFor="h-input" className="text-xs text-muted-foreground">
                  H
                </Label>
                <Input
                  id="h-input"
                  type="number"
                  min="0"
                  max="360"
                  value={color.h}
                  onChange={(e) => handleInputChange('h', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="s-input" className="text-xs text-muted-foreground">
                  S
                </Label>
                <Input
                  id="s-input"
                  type="number"
                  min="0"
                  max="100"
                  value={color.s}
                  onChange={(e) => handleInputChange('s', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="l-input" className="text-xs text-muted-foreground">
                  L
                </Label>
                <Input
                  id="l-input"
                  type="number"
                  min="0"
                  max="100"
                  value={color.l}
                  onChange={(e) => handleInputChange('l', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
                  HEX
                </Label>
                <Input
                  id="hex-input"
                  type="text"
                  value={color.hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              hsl({color.h} {color.s}% {color.l}%)
            </div>
          </TabsContent>

          <TabsContent value="oklch" className="space-y-3 mt-3">
            {displayOklch && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="oklch-l-input" className="text-xs text-muted-foreground">
                      L
                    </Label>
                    <Input
                      id="oklch-l-input"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={displayOklch.l}
                      onChange={(e) => handleOklchInputChange('l', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="oklch-c-input" className="text-xs text-muted-foreground">
                      C
                    </Label>
                    <Input
                      id="oklch-c-input"
                      type="number"
                      min="0"
                      max="0.4"
                      step="0.001"
                      value={displayOklch.c}
                      onChange={(e) => handleOklchInputChange('c', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="oklch-h-input" className="text-xs text-muted-foreground">
                      H
                    </Label>
                    <Input
                      id="oklch-h-input"
                      type="number"
                      min="0"
                      max="360"
                      value={displayOklch.h}
                      onChange={(e) => handleOklchInputChange('h', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  oklch({displayOklch.l.toFixed(2)} {displayOklch.c.toFixed(3)} {displayOklch.h.toFixed(2)})
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2">
          <div
            className="h-10 flex-1 rounded border border-border"
            style={{ backgroundColor: color.hex }}
          />
          <div className="text-xs text-muted-foreground font-mono">{color.hex}</div>
        </div>
      </div>
    </div>
  )
}
