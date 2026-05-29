import { useState } from 'react'
import { ColorToken } from '@/types/playground'
import { ColorPicker } from './ColorPicker'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'
import { Label } from '@acronis-platform/shadcn-uikit/react'
import { Badge } from '@acronis-platform/shadcn-uikit/react'
import { getContrastRatio, meetsWCAGAA } from '@/lib/playground/colorUtils'

interface ColorEditorProps {
  label: string
  color: ColorToken
  onChange: (color: ColorToken) => void
  contrastWith?: ColorToken
  description?: string
  className?: string
}

export const ColorEditor: React.FC<ColorEditorProps> = ({
  label,
  color,
  onChange,
  contrastWith,
  description,
  className = '',
}) => {
  const [open, setOpen] = useState(false)

  const contrastRatio = contrastWith ? getContrastRatio(color, contrastWith) : null
  const meetsAA = contrastWith ? meetsWCAGAA(color, contrastWith) : null

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {contrastRatio !== null && (
          <div className="flex items-center gap-2">
            <Badge variant={meetsAA ? 'default' : 'destructive'} className="text-xs">
              {contrastRatio.toFixed(2)}:1
            </Badge>
            <span className="text-xs text-muted-foreground">
              {meetsAA ? 'WCAG AA ✓' : 'WCAG AA ✗'}
            </span>
          </div>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              style={{
                backgroundColor: color.hex,
                color: color.l > 50 ? '#000' : '#fff',
              }}
            />
          }
        >
          <div className="flex items-center gap-3 w-full">
            <div className="h-6 w-6 rounded border border-white/20" style={{ backgroundColor: color.hex }} />
            <div className="flex flex-1 items-center gap-3">
              <div className="text-sm font-mono">{color.hex}</div>
              <div className="text-xs opacity-70">{color.css}</div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <ColorPicker color={color} onChange={onChange} label={label} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
