import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'
import { InfoIcon } from '@acronis-platform/shadcn-uikit'
export function PopoverWithActions() {
  return (
    <div className="flex justify-center rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          <InfoIcon className="mr-2 h-4 w-4" />
          Show Info
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Title</h4>
              <p className="text-sm text-muted-foreground">
                The discovery agent will obtain the neighbor IP addresses by using NetBIOS
                discovery, Web Service Discovery (WSD), and Address Resolution Protocol (ARP)
                table.
              </p>
            </div>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 text-primary">
                <span className="mr-2 h-4 w-4 rounded bg-primary" />
                First action
              </Button>
              <Button variant="link" className="h-auto p-0 text-primary">
                <span className="mr-2 h-4 w-4 rounded bg-primary" />
                Second action
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
