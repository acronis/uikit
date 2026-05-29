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
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function DialogBasic() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        Open Dialog
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-gray-600">
            This is a basic dialog with some content. You can add any content you want here.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogTrigger render={<Button variant="outline" />}>
            Cancel
          </DialogTrigger>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
