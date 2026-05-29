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
import { RotateIcon } from '@acronis-platform/shadcn-uikit'
export function DialogLoading() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        Process Data
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Processing</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <RotateIcon className="h-12 w-12 animate-spin text-[#2668C5]" />
            <p className="text-sm text-gray-600">
              Please wait while we process your request...
            </p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button disabled>Processing...</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
