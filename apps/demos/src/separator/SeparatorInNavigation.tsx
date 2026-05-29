import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorInNavigation() {
  return (
    <div className="flex items-center space-x-4 text-sm">
      <a href="#" className="hover:underline">
        Home
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="hover:underline">
        About
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="hover:underline">
        Services
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="hover:underline">
        Contact
      </a>
    </div>
  )
}
