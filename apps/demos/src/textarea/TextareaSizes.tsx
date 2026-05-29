import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaSizes() {
  return (
    <div className="space-y-4">
      <Textarea className="min-h-[60px]" placeholder="Small textarea (60px)" />
      <Textarea placeholder="Default textarea (80px)" />
      <Textarea className="min-h-[120px]" placeholder="Large textarea (120px)" />
      <Textarea className="min-h-[200px]" placeholder="Extra large textarea (200px)" />
    </div>
  )
}
