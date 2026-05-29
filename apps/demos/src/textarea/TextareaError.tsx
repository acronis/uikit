import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaError() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="error-message" className="text-sm font-medium text-[#243143]">
          Message
        </label>
        <Textarea
          id="error-message"
          placeholder="Enter your message..."
          className="border-red-500 focus-visible:border-red-500"
        />
        <p className="text-xs text-red-500">Message is required and cannot be empty</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="error-description" className="text-sm font-medium text-[#243143]">
          Description
        </label>
        <Textarea
          id="error-description"
          placeholder="Enter description..."
          className="border-red-500 focus-visible:border-red-500"
          defaultValue="Too short"
        />
        <p className="text-xs text-red-500">
          Description must be at least 20 characters long
        </p>
      </div>
    </div>
  )
}
