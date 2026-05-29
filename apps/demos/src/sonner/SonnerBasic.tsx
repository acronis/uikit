import { toast } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function SonnerBasic() {
  return <Button onClick={() => toast('Event has been created')}>Show Toast</Button>
}
