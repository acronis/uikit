import { Filter } from '@acronis-platform/shadcn-uikit/react'

export function FilterActiveState() {
  return (
    <div className="flex gap-4">
      <Filter active={false}>Inactive</Filter>
      <Filter active={true} count={3}>
        Active
      </Filter>
    </div>
  )
}
