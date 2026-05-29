import * as React from 'react'
import { Label, RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function RadioGroupCards() {
  const [value, setValue] = React.useState('card')

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div className="grid gap-4 md:grid-cols-3">
        <div
          className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
            value === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200'
          }`}
          onClick={() => setValue('card')}
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="card" id="plan-card" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="plan-card" className="cursor-pointer">
                Card View
              </Label>
              <p className="text-sm text-muted-foreground">Display items as cards</p>
            </div>
          </div>
        </div>

        <div
          className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
            value === 'list' ? 'border-primary bg-primary/5' : 'border-gray-200'
          }`}
          onClick={() => setValue('list')}
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="list" id="plan-list" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="plan-list" className="cursor-pointer">
                List View
              </Label>
              <p className="text-sm text-muted-foreground">Display items as a list</p>
            </div>
          </div>
        </div>

        <div
          className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
            value === 'grid' ? 'border-primary bg-primary/5' : 'border-gray-200'
          }`}
          onClick={() => setValue('grid')}
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="grid" id="plan-grid" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="plan-grid" className="cursor-pointer">
                Grid View
              </Label>
              <p className="text-sm text-muted-foreground">Display items in a grid</p>
            </div>
          </div>
        </div>
      </div>
    </RadioGroup>
  )
}
