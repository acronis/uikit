import * as React from 'react'
import { Button, ButtonGroup } from '@acronis-platform/shadcn-uikit/react'
import { BoldIcon, ItalicIcon, UnderlineIcon } from '../icons/missing-icons'
export function ButtonGroupTextFormatting() {
  const [textFormat, setTextFormat] = React.useState<string[]>([])

  const toggleFormat = (format: string) => {
    setTextFormat((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    )
  }

  return (
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
  )
}
