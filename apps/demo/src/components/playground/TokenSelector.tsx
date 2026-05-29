import { CheckIcon } from '@acronis-platform/shadcn-uikit'
import { PaletteIcon } from '@/components/icons/missing-icons'
import { usePlaygroundStore } from '@/store/playground/playgroundStore'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@acronis-platform/shadcn-uikit/react'

interface TokenSelectorProps {
  className?: string
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ className = '' }) => {
  const { activeTokenSetId, tokenSets, customTokenSet, setActiveTokenSet, resetCustomTokens } =
    usePlaygroundStore()

  const activeTokenSet = customTokenSet || tokenSets[activeTokenSetId]
  const isCustomActive = activeTokenSetId === 'custom' && customTokenSet

  const handleSelectTokenSet = (id: string) => {
    if (id === 'reset') {
      resetCustomTokens()
    } else {
      setActiveTokenSet(id)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className={className} />}>
        <PaletteIcon className="mr-2 h-4 w-4" />
        <span>{activeTokenSet?.name || 'Select Theme'}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme Presets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(tokenSets).map((tokenSet) => (
          <DropdownMenuItem
            key={tokenSet.id}
            onClick={() => handleSelectTokenSet(tokenSet.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded border"
                  style={{
                    backgroundColor: tokenSet.light.primary.hex,
                  }}
                />
                <div>
                  <div className="font-medium">{tokenSet.name}</div>
                  {tokenSet.description && (
                    <div className="text-xs text-muted-foreground">{tokenSet.description}</div>
                  )}
                </div>
              </div>
              {activeTokenSetId === tokenSet.id && !isCustomActive && (
                <CheckIcon className="h-4 w-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        {isCustomActive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border bg-gradient-to-r from-blue-500 to-purple-500" />
                  <div>
                    <div className="font-medium">Custom</div>
                    <div className="text-xs text-muted-foreground">Your customizations</div>
                  </div>
                </div>
                <CheckIcon className="h-4 w-4" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleSelectTokenSet('reset')}
              className="cursor-pointer text-destructive"
            >
              Reset to Default
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
