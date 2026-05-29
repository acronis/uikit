import { Button, ButtonGroup } from '@acronis-platform/shadcn-uikit/react'
import { BoldIcon, ItalicIcon, UnderlineIcon } from '../icons/missing-icons'
export function ButtonGroupWithIcons() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <BoldIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <ItalicIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <UnderlineIcon className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  )
}
