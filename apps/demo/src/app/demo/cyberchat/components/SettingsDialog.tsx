import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { SettingsIcon } from '@acronis-platform/shadcn-uikit'

interface SettingsDialogProps {
  trigger?: React.ReactNode
}

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={(trigger as React.ReactElement) || <Button variant="ghost" size="icon" className="h-6 w-6" />}>
        {!trigger && <SettingsIcon className="h-4 w-4" />}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader className="pb-4 px-6">
          <DialogTitle className="text-xl">Settings</DialogTitle>
          <DialogDescription className="text-base">
            Customize your CyberChat experience
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 px-6 py-2">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">General</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1 flex-1 pr-4">
                  <label className="text-sm font-medium leading-none">Theme</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Choose your preferred color theme
                  </p>
                </div>
                <select className="h-9 rounded-md border border-border bg-background px-3 text-sm">
                  <option>System</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1 flex-1 pr-4">
                  <label className="text-sm font-medium leading-none">Language</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Select your preferred language
                  </p>
                </div>
                <select className="h-9 rounded-md border border-border bg-background px-3 text-sm">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Chat Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Chat</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1 flex-1 pr-4">
                  <label className="text-sm font-medium leading-none">Default Model</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Choose the default AI model
                  </p>
                </div>
                <select className="h-9 rounded-md border border-border bg-background px-3 text-sm">
                  <option>Auto</option>
                  <option>GPT-4</option>
                  <option>GPT-3.5</option>
                  <option>Claude</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1 flex-1 pr-4">
                  <label className="text-sm font-medium leading-none">Message History</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Number of messages to keep
                  </p>
                </div>
                <select className="h-9 rounded-md border border-border bg-background px-3 text-sm">
                  <option>50</option>
                  <option>100</option>
                  <option>200</option>
                  <option>Unlimited</option>
                </select>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1 flex-1 pr-4">
                  <label className="text-sm font-medium leading-none">Save Chat History</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Store conversations locally
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1 flex-1 pr-4">
                  <label className="text-sm font-medium leading-none">Analytics</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Help improve the experience
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="peer h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer separator */}
        <div className="border-t border-border pt-6 px-6 pb-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
