import {
  Empty,
  EmptyIcon,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
  EmptyLinks,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { TimesCircleIcon } from '@acronis-platform/shadcn-uikit'
export function EmptyError() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border rounded-lg bg-gray-50">
      <Empty>
        <EmptyIcon className="h-24 w-24">
          <TimesCircleIcon className="text-red-500" />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>Failed to load content</EmptyTitle>
          <EmptyDescription>
            An error occurred while loading content. Please refresh the page and try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyActions>
          <Button>Try Again</Button>
          <EmptyLinks>
            <a href="#" className="text-sm font-semibold text-[#2668C5] hover:underline">
              Details
            </a>
          </EmptyLinks>
        </EmptyActions>
      </Empty>
    </div>
  )
}
