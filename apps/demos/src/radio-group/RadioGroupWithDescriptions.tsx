import { Label, RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function RadioGroupWithDescriptions() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="default" id="r2-default" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r2-default">Default</Label>
          <p className="text-sm text-muted-foreground">The default spacing for components.</p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="comfortable" id="r2-comfortable" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r2-comfortable">Comfortable</Label>
          <p className="text-sm text-muted-foreground">
            Increased spacing for better readability.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="compact" id="r2-compact" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r2-compact">Compact</Label>
          <p className="text-sm text-muted-foreground">
            Reduced spacing to fit more content.
          </p>
        </div>
      </div>
    </RadioGroup>
  )
}
