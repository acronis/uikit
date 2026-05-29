import {
  Empty,
  EmptyIcon,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
  EmptyLinks,
} from '@acronis-platform/shadcn-uikit/react'
import { FileTextIcon } from '@acronis-platform/shadcn-uikit'
export function EmptyOnlyLinks() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border rounded-lg bg-gray-50">
      <Empty>
        <EmptyIcon className="h-24 w-24">
          <FileTextIcon className="text-[#2668C5]" />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>No documents</EmptyTitle>
          <EmptyDescription>You haven&apos;t created any documents yet.</EmptyDescription>
        </EmptyHeader>
        <EmptyActions>
          <EmptyLinks>
            <a href="#" className="text-sm font-semibold text-[#2668C5] hover:underline">
              Browse templates
            </a>
            <a href="#" className="text-sm font-semibold text-[#2668C5] hover:underline">
              Import from file
            </a>
          </EmptyLinks>
        </EmptyActions>
      </Empty>
    </div>
  )
}
