import {
  Empty,
  EmptyIcon,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { CalendarIcon, MailIcon, ShoppingCartIcon } from '@acronis-platform/shadcn-uikit'
import { DatabaseIcon } from '../icons/missing-icons'
export function EmptyVariousStates() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex min-h-[250px] items-center justify-center border rounded-lg bg-gray-50">
        <Empty>
          <EmptyIcon className="h-24 w-24">
            <DatabaseIcon className="text-[#2668C5]" />
          </EmptyIcon>
          <EmptyHeader>
            <EmptyTitle>No data available</EmptyTitle>
            <EmptyDescription>There is no data to display at this time.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>

      <div className="flex min-h-[250px] items-center justify-center border rounded-lg bg-gray-50">
        <Empty>
          <EmptyIcon className="h-24 w-24">
            <ShoppingCartIcon className="text-[#2668C5]" />
          </EmptyIcon>
          <EmptyHeader>
            <EmptyTitle>Cart is empty</EmptyTitle>
            <EmptyDescription>Add items to your cart to get started.</EmptyDescription>
          </EmptyHeader>
          <EmptyActions>
            <Button variant="outline">Browse Products</Button>
          </EmptyActions>
        </Empty>
      </div>

      <div className="flex min-h-[250px] items-center justify-center border rounded-lg bg-gray-50">
        <Empty>
          <EmptyIcon className="h-24 w-24">
            <CalendarIcon className="text-[#2668C5]" />
          </EmptyIcon>
          <EmptyHeader>
            <EmptyTitle>No events scheduled</EmptyTitle>
            <EmptyDescription>Create your first event to get started.</EmptyDescription>
          </EmptyHeader>
          <EmptyActions>
            <Button>Create Event</Button>
          </EmptyActions>
        </Empty>
      </div>

      <div className="flex min-h-[250px] items-center justify-center border rounded-lg bg-gray-50">
        <Empty>
          <EmptyIcon className="h-24 w-24">
            <MailIcon className="text-[#2668C5]" />
          </EmptyIcon>
          <EmptyHeader>
            <EmptyTitle>Inbox is empty</EmptyTitle>
            <EmptyDescription>You&apos;re all caught up!</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  )
}
