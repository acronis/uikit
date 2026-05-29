import { Button } from '@acronis-platform/shadcn-uikit/react'

import { ChevronUpdownIcon } from '@acronis-platform/shadcn-uikit'
export function ComboboxDisabled() {
  return (
    <Button variant="outline" role="combobox" disabled className="w-[280px] justify-between">
      Select framework...
      <ChevronUpdownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )
}
