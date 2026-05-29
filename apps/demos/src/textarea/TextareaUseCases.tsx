import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaUseCases() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Code Snippet</label>
        <Textarea
          className="font-mono text-xs"
          placeholder="Paste your code here..."
          rows={6}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Address</label>
        <Textarea placeholder="Enter your full address..." rows={4} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Review</label>
        <Textarea placeholder="Write your review..." className="min-h-[100px]" />
      </div>
    </div>
  )
}
