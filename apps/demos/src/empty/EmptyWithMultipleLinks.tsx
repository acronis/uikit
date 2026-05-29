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
import { UsersIcon } from '@acronis-platform/shadcn-uikit'
export function EmptyWithMultipleLinks() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border rounded-lg bg-gray-50">
      <Empty>
        <EmptyIcon className="h-24 w-24">
          <UsersIcon className="text-[#2668C5]" />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>No team members</EmptyTitle>
          <EmptyDescription>
            Start collaborating by inviting team members to your workspace.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyActions>
          <Button>Invite Team Members</Button>
          <EmptyLinks>
            <a href="#" className="text-sm font-semibold text-[#2668C5] hover:underline">
              Learn more
            </a>
            <a href="#" className="text-sm font-semibold text-[#2668C5] hover:underline">
              View documentation
            </a>
          </EmptyLinks>
        </EmptyActions>
      </Empty>
    </div>
  )
}
