import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from '@acronis-platform/shadcn-uikit/react'

export function TooltipPositions() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Top
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Tooltip on top</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex gap-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Left
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip on left</p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Right
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip on right</p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Bottom
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Tooltip on bottom</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
