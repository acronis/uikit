import { useState } from 'react'
import { Textarea } from '@acronis-platform/shadcn-uikit/react'

export function TextareaCharCounter() {
  const [feedback, setFeedback] = useState('')
  const charLimit = 500

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="limited-text" className="text-sm font-medium text-[#243143]">
          Feedback ({feedback.length}/{charLimit})
        </label>
        <Textarea
          id="limited-text"
          placeholder="Enter your feedback..."
          value={feedback}
          onChange={(e) => {
            if (e.target.value.length <= charLimit) {
              setFeedback(e.target.value)
            }
          }}
          maxLength={charLimit}
        />
        <p className="text-xs text-[rgba(36,49,67,0.7)]">
          {charLimit - feedback.length} characters remaining
        </p>
      </div>
    </div>
  )
}
