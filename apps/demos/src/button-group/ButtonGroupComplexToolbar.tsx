import * as React from 'react'
import { Button, ButtonGroup } from '@acronis-platform/shadcn-uikit/react'
import { ListIcon } from '@acronis-platform/shadcn-uikit'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  ListOrderedIcon,
  RedoIcon,
  UnderlineIcon,
  UndoIcon,
} from '../icons/missing-icons'
export function ButtonGroupComplexToolbar() {
  const [alignment, setAlignment] = React.useState<string>('left')
  const [textFormat, setTextFormat] = React.useState<string[]>([])

  const toggleFormat = (format: string) => {
    setTextFormat((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    )
  }

  return (
    <div className="flex flex-wrap gap-4">
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <UndoIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <RedoIcon className="h-4 w-4" />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant={textFormat.includes('bold') ? 'default' : 'outline'}
          size="icon"
          onClick={() => toggleFormat('bold')}
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={textFormat.includes('italic') ? 'default' : 'outline'}
          size="icon"
          onClick={() => toggleFormat('italic')}
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={textFormat.includes('underline') ? 'default' : 'outline'}
          size="icon"
          onClick={() => toggleFormat('underline')}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
      </ButtonGroup>

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

      <ButtonGroup>
        <Button variant="outline">
          <ListIcon className="mr-2 h-4 w-4" />
          Bullet
        </Button>
        <Button variant="outline">
          <ListOrderedIcon className="mr-2 h-4 w-4" />
          Numbered
        </Button>
      </ButtonGroup>
    </div>
  )
}
