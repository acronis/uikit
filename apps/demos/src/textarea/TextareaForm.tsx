import { useState } from 'react'
import { Textarea, Button } from '@acronis-platform/shadcn-uikit/react'

export function TextareaForm() {
  const [comment, setComment] = useState('')
  const [description, setDescription] = useState('')

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        alert(`Form submitted!\nComment: ${comment}\nDescription: ${description}`)
      }}
    >
      <div className="space-y-2">
        <label htmlFor="form-comment" className="text-sm font-medium text-[#243143]">
          Comment <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="form-comment"
          placeholder="Enter your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="form-description" className="text-sm font-medium text-[#243143]">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="form-description"
          placeholder="Provide a detailed description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px]"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  )
}
