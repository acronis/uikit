import { Chip } from '@acronis-platform/shadcn-uikit/react'
import { StarIcon } from '@acronis-platform/shadcn-uikit'
import { TagIcon } from '../icons/missing-icons'
export function ChipFilters() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Active Filters:</p>
      <div className="flex flex-wrap gap-2">
        <Chip icon={<TagIcon className="h-4 w-4" />} onRemove={() => {}}>
          Category: Electronics
        </Chip>
        <Chip icon={<TagIcon className="h-4 w-4" />} onRemove={() => {}}>
          Price: $100-$500
        </Chip>
        <Chip icon={<TagIcon className="h-4 w-4" />} onRemove={() => {}}>
          Brand: Samsung
        </Chip>
        <Chip icon={<StarIcon className="h-4 w-4" />} onRemove={() => {}}>
          Rating: 4+
        </Chip>
      </div>
    </div>
  )
}
