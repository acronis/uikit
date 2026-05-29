import { Filter } from '@acronis-platform/shadcn-uikit/react'

export function FilterWithCounter() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Filter count={0}>No Filters</Filter>
      <Filter count={1}>Filter</Filter>
      <Filter count={3}>Filter</Filter>
      <Filter count={5}>Filter</Filter>
      <Filter count={12}>Filter</Filter>
      <Filter count={99}>Filter</Filter>
    </div>
  )
}
