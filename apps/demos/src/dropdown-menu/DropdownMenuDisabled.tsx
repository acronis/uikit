import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@acronis-platform/shadcn-uikit/react'
import {
  CloudIcon,
  MailIcon,
  SettingsIcon,
  UserIcon,
} from '@acronis-platform/shadcn-uikit'
export function DropdownMenuDisabled() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <SettingsIcon className="mr-2 h-4 w-4" />
          <span>Settings (Coming Soon)</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MailIcon className="mr-2 h-4 w-4" />
          <span>Contact</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <CloudIcon className="mr-2 h-4 w-4" />
          <span>Cloud Storage (Unavailable)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
