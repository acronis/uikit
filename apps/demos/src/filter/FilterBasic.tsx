import { Filter } from '@acronis-platform/shadcn-uikit/react'

export function FilterBasic() {
  return (
    <div className="flex gap-4">
      <Filter />
      <Filter>Custom Label</Filter>
      <Filter>Apply Filters</Filter>
    </div>
  )
}
