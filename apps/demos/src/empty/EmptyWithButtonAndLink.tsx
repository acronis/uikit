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
import { SearchIcon } from '@acronis-platform/shadcn-uikit'
export function EmptyWithButtonAndLink() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border rounded-lg bg-gray-50">
      <Empty>
        <EmptyIcon className="h-24 w-24">
          <SearchIcon className="text-[#2668C5]" />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>
            We couldn&apos;t find any results matching your search. Try adjusting your
            filters.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyActions>
          <Button>Clear Filters</Button>
          <EmptyLinks>
            <a href="#" className="text-sm font-semibold text-[#2668C5] hover:underline">
              View all items
            </a>
          </EmptyLinks>
        </EmptyActions>
      </Empty>
    </div>
  )
}
