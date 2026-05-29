import { Button, ButtonGroup, ButtonGroupSeparator } from '@acronis-platform/shadcn-uikit/react'
import { ClipboardIcon, CopyIcon } from '@acronis-platform/shadcn-uikit'
import { RedoIcon, ScissorsIcon, UndoIcon } from '../icons/missing-icons'
export function ButtonGroupWithSeparators() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <UndoIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <RedoIcon className="h-4 w-4" />
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon">
        <CopyIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <ScissorsIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <ClipboardIcon className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  )
}
