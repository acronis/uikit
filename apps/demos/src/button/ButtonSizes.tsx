import { Button } from '@acronis-platform/shadcn-uikit/react'

export function ButtonSizes() {
  return (
    <div className="button-grid">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="secondary">
        ⋯
      </Button>
    </div>
  )
}
