import { Filter } from '@acronis-platform/shadcn-uikit/react'

export function FilterDisabled() {
  return (
    <div className="flex gap-4">
      <Filter disabled>Disabled</Filter>
      <Filter disabled count={3}>
        Disabled with Count
      </Filter>
    </div>
  )
}
