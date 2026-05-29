import { Button, ButtonGroup } from '@acronis-platform/shadcn-uikit/react'

export function ButtonGroupSizes() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Small</p>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            Small
          </Button>
          <Button variant="outline" size="sm">
            Buttons
          </Button>
          <Button variant="outline" size="sm">
            Group
          </Button>
        </ButtonGroup>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Default</p>
        <ButtonGroup>
          <Button variant="outline">Default</Button>
          <Button variant="outline">Buttons</Button>
          <Button variant="outline">Group</Button>
        </ButtonGroup>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Large</p>
        <ButtonGroup>
          <Button variant="outline" size="lg">
            Large
          </Button>
          <Button variant="outline" size="lg">
            Buttons
          </Button>
          <Button variant="outline" size="lg">
            Group
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
