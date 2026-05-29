import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from '@acronis-platform/shadcn-uikit/react'

export function TooltipCustomDelay() {
  return (
    <TooltipProvider delay={800}>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline">Slow to appear</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip has a longer delay</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
