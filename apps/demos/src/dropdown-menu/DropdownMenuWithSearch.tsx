import { useState } from 'react'
import { Button, Input } from '@acronis-platform/shadcn-uikit/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@acronis-platform/shadcn-uikit/react'
import { ChevronDownIcon, SearchIcon } from '@acronis-platform/shadcn-uikit'
export function DropdownMenuWithSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  const menuItems = [
    'First value',
    'Second value',
    'Third value',
    'Fourth value',
    'Fifth value',
    'Sixth value',
    'Seventh value',
    'Eighth value',
  ]

  const filteredItems = menuItems.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Select Value
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="px-2 py-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <DropdownMenuItem key={item}>
              <span>{item}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No results found
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
