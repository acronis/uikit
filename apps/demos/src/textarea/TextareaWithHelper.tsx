import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaWithHelper() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium text-[#243143]">
          Bio
        </label>
        <Textarea id="bio" placeholder="Tell us about yourself..." />
        <p className="text-xs text-[rgba(36,49,67,0.7)]">
          Write a short bio to introduce yourself
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-[#243143]">
          Notes
        </label>
        <Textarea id="notes" placeholder="Add your notes here..." />
        <p className="text-xs text-[rgba(36,49,67,0.7)]">
          These notes will be visible to your team
        </p>
      </div>
    </div>
  )
}
