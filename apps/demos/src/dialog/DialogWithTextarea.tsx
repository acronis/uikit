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
import { Button, Input, Textarea } from '@acronis-platform/shadcn-uikit/react'

export function DialogWithTextarea() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        Leave Feedback
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input id="subject" placeholder="Brief description" />
            </div>
            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Feedback
              </label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogTrigger render={<Button variant="outline" />}>
            Cancel
          </DialogTrigger>
          <Button>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
