import { Button, ButtonGroup } from '@acronis-platform/shadcn-uikit/react'
import { PauseIcon, PlayIcon } from '@acronis-platform/shadcn-uikit'
import { SkipBackIcon, SkipForwardIcon } from '../icons/missing-icons'
export function ButtonGroupMediaControls() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <SkipBackIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <PlayIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <PauseIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <SkipForwardIcon className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  )
}
