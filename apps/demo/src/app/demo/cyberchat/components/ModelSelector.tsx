import { useEffect, useRef } from 'react'
import { Button, Switch, Separator } from '@acronis-platform/shadcn-uikit/react'
import { ChevronDownIcon } from '@acronis-platform/shadcn-uikit'
import { useCyberChatStore } from '../store/useCyberChatStore'
import { RadialProgress } from './RadialProgress'

export function ModelSelector() {
  const {
    models,
    selectedModel,
    autoModelEnabled,
    modelDropdownOpen,
    setSelectedModel,
    toggleAutoModel,
    toggleModelDropdown,
  } = useCyberChatStore()

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (modelDropdownOpen) {
          toggleModelDropdown()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [modelDropdownOpen, toggleModelDropdown])

  const selectedModelName = models.find((m) => m.id === selectedModel)?.name || 'Auto'

  const premiumModels = models.filter((m) => m.tier === 'premium')
  const defaultModels = models.filter((m) => m.tier === 'default')

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleModelDropdown}
        className="h-9 min-w-[140px]"
      >
        Model: {selectedModelName}
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>

      {modelDropdownOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-[280px] bg-popover border border-border rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Auto Section */}
          <div className="px-2">
            <div className="flex items-center justify-between px-2 py-2 hover:bg-accent/50 rounded-md transition-colors">
              <span className="text-sm">Auto</span>
              <Switch
                checked={autoModelEnabled}
                onCheckedChange={toggleAutoModel}
                className="scale-75"
              />
            </div>
          </div>

          <Separator className="my-2" />

          {/* Premium Section */}
          <div className="px-2">
            <div className="px-2 py-1">
              <p className="text-sm font-semibold">Premium</p>
            </div>
            {premiumModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id)
                  toggleModelDropdown()
                }}
                disabled={autoModelEnabled}
                className={`
                  w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-colors
                  ${autoModelEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/50'}
                  ${selectedModel === model.id && !autoModelEnabled ? 'bg-accent/70' : ''}
                `}
              >
                <span className="flex-1 text-left truncate">{model.name}</span>
                {model.usage !== undefined && (
                  <RadialProgress
                    value={model.usage}
                    color={model.usageColor}
                    size={16}
                    strokeWidth={2}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="h-2 my-2" />

          {/* Default Section */}
          <div className="px-2">
            <div className="px-2 py-1">
              <p className="text-sm font-semibold">Default</p>
            </div>
            {defaultModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id)
                  toggleModelDropdown()
                }}
                disabled={autoModelEnabled}
                className={`
                  w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-colors
                  ${autoModelEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/50'}
                  ${selectedModel === model.id && !autoModelEnabled ? 'bg-accent/70' : ''}
                `}
              >
                <span className="flex-1 text-left truncate">{model.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
