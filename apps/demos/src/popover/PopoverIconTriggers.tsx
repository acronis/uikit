import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'
import {
  BellIcon,
  HelpCircleIcon,
  SettingsIcon,
  UserIcon,
} from '@acronis-platform/shadcn-uikit'
export function PopoverIconTriggers() {
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="ghost" size="icon" />}>
          <HelpCircleIcon className="h-5 w-5" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Help</h4>
            <p className="text-sm text-muted-foreground">
              Need assistance? Click here to access our help documentation and support
              resources.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="ghost" size="icon" />}>
          <SettingsIcon className="h-5 w-5" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Customize your preferences and configure application settings.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="ghost" size="icon" />}>
          <BellIcon className="h-5 w-5" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have 3 new notifications. Click to view all.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="ghost" size="icon" />}>
          <UserIcon className="h-5 w-5" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Profile</h4>
            <p className="text-sm text-muted-foreground">
              View and edit your profile information.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
