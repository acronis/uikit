import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'
import { FilterIcon } from '@acronis-platform/shadcn-uikit'
export function PopoverFilter() {
  return (
    <div className="flex justify-center rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          <FilterIcon className="mr-2 h-4 w-4" />
          Filters
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-semibold">Filter Options</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="option1" className="h-4 w-4" />
                <label htmlFor="option1" className="text-sm">
                  Show completed items
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="option2" className="h-4 w-4" />
                <label htmlFor="option2" className="text-sm">
                  Show archived items
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="option3" className="h-4 w-4" />
                <label htmlFor="option3" className="text-sm">
                  Show deleted items
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm">
                Clear
              </Button>
              <Button size="sm">Apply</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
