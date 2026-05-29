import { Chip } from '@acronis-platform/shadcn-uikit/react'

export function ChipBasic() {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip>Default</Chip>
      <Chip>Primary</Chip>
      <Chip>Secondary</Chip>
      <Chip>Success</Chip>
      <Chip>Warning</Chip>
      <Chip>Error</Chip>
    </div>
  )
}
