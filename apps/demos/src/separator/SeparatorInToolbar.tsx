import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorInToolbar() {
  return (
    <div className="flex items-center space-x-2 rounded-lg border p-2">
      <button className="rounded p-2 hover:bg-accent">Bold</button>
      <button className="rounded p-2 hover:bg-accent">Italic</button>
      <button className="rounded p-2 hover:bg-accent">Underline</button>
      <Separator orientation="vertical" className="h-6" />
      <button className="rounded p-2 hover:bg-accent">Left</button>
      <button className="rounded p-2 hover:bg-accent">Center</button>
      <button className="rounded p-2 hover:bg-accent">Right</button>
      <Separator orientation="vertical" className="h-6" />
      <button className="rounded p-2 hover:bg-accent">Link</button>
      <button className="rounded p-2 hover:bg-accent">Image</button>
    </div>
  )
}
