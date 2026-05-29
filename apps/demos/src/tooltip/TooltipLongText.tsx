import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from '@acronis-platform/shadcn-uikit/react'

export function TooltipLongText() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Hover for details
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>
            This is a longer tooltip text that provides more detailed information about the
            element.
          </p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
