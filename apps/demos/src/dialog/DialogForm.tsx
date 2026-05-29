import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogBody,
  DialogCloseButton,
  DialogTrigger,
} from '@acronis-platform/shadcn-uikit/react'
import { Button, Input } from '@acronis-platform/shadcn-uikit/react'

export function DialogForm() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        Create Account
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogTrigger render={<Button variant="outline" />}>
            Cancel
          </DialogTrigger>
          <Button>Create Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
