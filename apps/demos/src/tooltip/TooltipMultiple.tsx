import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from '@acronis-platform/shadcn-uikit/react'

export function TooltipMultiple() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger render={<Button variant="default" />}>
            Save
          </TooltipTrigger>
          <TooltipContent>
            <p>Save your changes</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary" />}>
            Cancel
          </TooltipTrigger>
          <TooltipContent>
            <p>Discard changes</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="destructive" />}>
            Delete
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete permanently</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
