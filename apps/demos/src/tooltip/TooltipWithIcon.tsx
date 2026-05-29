import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from '@acronis-platform/shadcn-uikit/react'
import { InfoIcon } from '@acronis-platform/shadcn-uikit'
export function TooltipWithIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <button className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-gray-200 hover:bg-gray-300 transition-colors" />
          }
        >
          <InfoIcon className="w-4 h-4 text-gray-600" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
