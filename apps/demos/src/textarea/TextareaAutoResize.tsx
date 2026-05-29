import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaAutoResize() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="auto-resize" className="text-sm font-medium text-[#243143]">
          Auto-growing Textarea
        </label>
        <Textarea
          id="auto-resize"
          placeholder="This textarea grows automatically..."
          className="resize-none"
          rows={3}
        />
        <p className="text-xs text-[rgba(36,49,67,0.7)]">
          This textarea automatically adjusts its height
        </p>
      </div>
    </div>
  )
}
