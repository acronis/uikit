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
import { InfoIcon } from '@acronis-platform/shadcn-uikit'
export function DialogInfo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        View Info
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Important Information</p>
                <p className="text-sm text-gray-600">
                  This dialog provides important information about the system. Please read
                  carefully before proceeding.
                </p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-8">
              <li>Feature A is now available</li>
              <li>Feature B has been updated</li>
              <li>Feature C will be deprecated soon</li>
            </ul>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogTrigger render={<Button />}>
            Got it
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
