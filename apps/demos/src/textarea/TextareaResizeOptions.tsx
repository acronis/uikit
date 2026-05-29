import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaResizeOptions() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">No Resize</label>
        <Textarea className="resize-none" placeholder="Cannot be resized" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Vertical Resize</label>
        <Textarea className="resize-y" placeholder="Can be resized vertically" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Both Directions</label>
        <Textarea className="resize" placeholder="Can be resized in both directions" />
      </div>
    </div>
  )
}
