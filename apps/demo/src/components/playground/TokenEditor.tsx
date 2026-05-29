import { usePlaygroundStore } from '@/store/playground/playgroundStore'
import { ColorToken } from '@/types/playground'
import { TokenGroup } from './TokenGroup'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { RotateIcon } from '@acronis-platform/shadcn-uikit'

export const TokenEditor: React.FC = () => {
  const { activeTokenSetId, tokenSets, customTokenSet, updateCustomTokens, resetCustomTokens } =
    usePlaygroundStore()

  const activeTokenSet = customTokenSet || tokenSets[activeTokenSetId]
  const isCustom = !!customTokenSet

  const handleColorChange = (mode: 'light' | 'dark', key: string, color: ColorToken) => {
    updateCustomTokens({
      [mode]: {
        [key]: color,
      },
    })
  }

  const baseColors = [
    { key: 'background', label: 'Background', description: 'Main background color' },
    { key: 'foreground', label: 'Foreground', description: 'Main text color', contrastWith: 'background' },
    { key: 'card', label: 'Card', description: 'Card background color' },
    { key: 'cardForeground', label: 'Card Foreground', description: 'Card text color', contrastWith: 'card' },
  ]

  const interactiveColors = [
    { key: 'primary', label: 'Primary', description: 'Primary action color' },
    { key: 'primaryForeground', label: 'Primary Foreground', description: 'Text on primary', contrastWith: 'primary' },
    { key: 'secondary', label: 'Secondary', description: 'Secondary action color' },
    { key: 'secondaryForeground', label: 'Secondary Foreground', description: 'Text on secondary', contrastWith: 'secondary' },
    { key: 'accent', label: 'Accent', description: 'Accent color for highlights' },
    { key: 'accentForeground', label: 'Accent Foreground', description: 'Text on accent', contrastWith: 'accent' },
  ]

  const utilityColors = [
    { key: 'muted', label: 'Muted', description: 'Muted background color' },
    { key: 'mutedForeground', label: 'Muted Foreground', description: 'Muted text color', contrastWith: 'muted' },
    { key: 'destructive', label: 'Destructive', description: 'Destructive action color' },
    { key: 'destructiveForeground', label: 'Destructive Foreground', description: 'Text on destructive', contrastWith: 'destructive' },
    { key: 'border', label: 'Border', description: 'Border color' },
    { key: 'input', label: 'Input', description: 'Input border color' },
    { key: 'ring', label: 'Ring', description: 'Focus ring color' },
  ]

  const surfaceColors = [
    { key: 'popover', label: 'Popover', description: 'Popover background' },
    { key: 'popoverForeground', label: 'Popover Foreground', description: 'Popover text', contrastWith: 'popover' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Color Tokens</h3>
          <p className="text-sm text-muted-foreground">
            {isCustom ? 'Editing custom theme' : `Viewing ${activeTokenSet?.name || 'theme'} theme`}
          </p>
        </div>
        {isCustom && (
          <Button variant="outline" size="sm" onClick={resetCustomTokens}>
            <RotateIcon className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
        )}
      </div>

      <Tabs defaultValue="light" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="light">Light Mode</TabsTrigger>
          <TabsTrigger value="dark">Dark Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="light" className="space-y-4 mt-6">
          <TokenGroup
            title="Base Colors"
            description="Fundamental colors for backgrounds and text"
            tokens={activeTokenSet.light}
            items={baseColors}
            onChange={(key, color) => handleColorChange('light', key, color)}
          />

          <TokenGroup
            title="Interactive Colors"
            description="Colors for buttons and interactive elements"
            tokens={activeTokenSet.light}
            items={interactiveColors}
            onChange={(key, color) => handleColorChange('light', key, color)}
          />

          <TokenGroup
            title="Utility Colors"
            description="Borders, states, and utility colors"
            tokens={activeTokenSet.light}
            items={utilityColors}
            onChange={(key, color) => handleColorChange('light', key, color)}
          />

          <TokenGroup
            title="Surface Colors"
            description="Overlay and surface colors"
            tokens={activeTokenSet.light}
            items={surfaceColors}
            onChange={(key, color) => handleColorChange('light', key, color)}
          />
        </TabsContent>

        <TabsContent value="dark" className="space-y-4 mt-6">
          <TokenGroup
            title="Base Colors"
            description="Fundamental colors for backgrounds and text"
            tokens={activeTokenSet.dark}
            items={baseColors}
            onChange={(key, color) => handleColorChange('dark', key, color)}
          />

          <TokenGroup
            title="Interactive Colors"
            description="Colors for buttons and interactive elements"
            tokens={activeTokenSet.dark}
            items={interactiveColors}
            onChange={(key, color) => handleColorChange('dark', key, color)}
          />

          <TokenGroup
            title="Utility Colors"
            description="Borders, states, and utility colors"
            tokens={activeTokenSet.dark}
            items={utilityColors}
            onChange={(key, color) => handleColorChange('dark', key, color)}
          />

          <TokenGroup
            title="Surface Colors"
            description="Overlay and surface colors"
            tokens={activeTokenSet.dark}
            items={surfaceColors}
            onChange={(key, color) => handleColorChange('dark', key, color)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
