import * as React from 'react'
import { Button, ButtonGroup } from '@acronis-platform/shadcn-uikit/react'
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from '../icons/missing-icons'
export function ButtonGroupTextAlignment() {
  const [alignment, setAlignment] = React.useState<string>('left')

  return (
    <ButtonGroup>
      <Button
        variant={alignment === 'left' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setAlignment('left')}
      >
        <AlignLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={alignment === 'center' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setAlignment('center')}
      >
        <AlignCenterIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={alignment === 'right' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setAlignment('right')}
      >
        <AlignRightIcon className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  )
}
