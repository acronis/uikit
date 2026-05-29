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

export function DialogSizes() {
  return (
    <div className="flex flex-wrap gap-4">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Small (464px)
        </DialogTrigger>
        <DialogContent className="max-w-[464px]">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-gray-600">This is a small dialog (464px width).</p>
          </DialogBody>
          <DialogFooter>
            <Button>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Medium (672px)
        </DialogTrigger>
        <DialogContent className="max-w-[672px]">
          <DialogHeader>
            <DialogTitle>Medium Dialog</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-gray-600">This is a medium dialog (672px width).</p>
          </DialogBody>
          <DialogFooter>
            <Button>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Large (832px)
        </DialogTrigger>
        <DialogContent className="max-w-[832px]">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-gray-600">This is a large dialog (832px width).</p>
          </DialogBody>
          <DialogFooter>
            <Button>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
