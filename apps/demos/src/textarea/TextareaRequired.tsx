import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaRequired() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="required-message" className="text-sm font-medium text-[#243143]">
          Message <span className="text-red-500">*</span>
        </label>
        <Textarea id="required-message" placeholder="Enter your message..." required />
      </div>
      <div className="space-y-2">
        <label htmlFor="required-feedback" className="text-sm font-medium text-[#243143]">
          Feedback <span className="text-red-500">*</span>
        </label>
        <Textarea id="required-feedback" placeholder="Share your feedback..." required />
      </div>
    </div>
  )
}
