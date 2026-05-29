import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorInSidebar() {
  return (
    <div className="w-64 rounded-lg border p-4">
      <div className="space-y-1">
        <div className="px-2 py-1.5 text-sm font-medium">Main Menu</div>
        <div className="px-2 py-1.5 text-sm hover:bg-accent">Dashboard</div>
        <div className="px-2 py-1.5 text-sm hover:bg-accent">Projects</div>
        <div className="px-2 py-1.5 text-sm hover:bg-accent">Tasks</div>
        <Separator className="my-2" />
        <div className="px-2 py-1.5 text-sm font-medium">Settings</div>
        <div className="px-2 py-1.5 text-sm hover:bg-accent">Profile</div>
        <div className="px-2 py-1.5 text-sm hover:bg-accent">Preferences</div>
        <Separator className="my-2" />
        <div className="px-2 py-1.5 text-sm hover:bg-accent">Logout</div>
      </div>
    </div>
  )
}
