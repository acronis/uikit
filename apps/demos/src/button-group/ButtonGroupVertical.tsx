import { Button, ButtonGroup } from '@acronis-platform/shadcn-uikit/react'

export function ButtonGroupVertical() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  )
}
