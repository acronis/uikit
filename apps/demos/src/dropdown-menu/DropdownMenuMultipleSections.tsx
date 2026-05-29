import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@acronis-platform/shadcn-uikit/react'
import { MailIcon, MessagesIcon, SettingsIcon } from '@acronis-platform/shadcn-uikit'
import { KeyboardIcon } from '../icons/missing-icons'
export function DropdownMenuMultipleSections() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Options
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <MailIcon className="mr-2 h-4 w-4" />
          <span>Send Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessagesIcon className="mr-2 h-4 w-4" />
          <span>Send Message</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SettingsIcon className="mr-2 h-4 w-4" />
          <span>Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <KeyboardIcon className="mr-2 h-4 w-4" />
          <span>Shortcuts</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
