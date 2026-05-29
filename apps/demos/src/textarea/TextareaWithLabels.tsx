import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaWithLabels() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="comments" className="text-sm font-medium text-[#243143]">
          Comments
        </label>
        <Textarea id="comments" placeholder="Enter your comments..." />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-[#243143]">
          Description
        </label>
        <Textarea id="description" placeholder="Describe your project..." />
      </div>
    </div>
  )
}
