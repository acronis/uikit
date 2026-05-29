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
import { ExclamationCircleIcon } from '@acronis-platform/shadcn-uikit'
export function DialogConfirmation() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete Item
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <div className="flex items-start gap-4">
            <ExclamationCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Are you sure you want to delete this item?
              </p>
              <p className="text-sm text-gray-600">
                This action cannot be undone. This will permanently delete the item and remove
                all associated data.
              </p>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogTrigger render={<Button variant="outline" />}>
            Cancel
          </DialogTrigger>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
