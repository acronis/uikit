import { useState } from 'react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { SearchIcon } from '@acronis-platform/shadcn-uikit'
export function InputSearch() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          className="pl-10"
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {search && (
        <p className="text-sm text-gray-600">
          Searching for: <strong>{search}</strong>
        </p>
      )}
    </div>
  )
}
