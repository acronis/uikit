import { useState } from 'react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  RotateIcon,
  SearchIcon,
} from '@acronis-platform/shadcn-uikit'
export function InputSearchDemo() {
  const [search, setSearch] = useState('')
  const [searchWithFolder, setSearchWithFolder] = useState('')
  const [searchFilled, setSearchFilled] = useState('Request')
  const [searchLoading, setSearchLoading] = useState(false)
  const [folderPath, setFolderPath] = useState('')
  const [folderPathFilled, setFolderPathFilled] = useState('C:\\Windows\\Test')

  const handleSearch = () => {
    setSearchLoading(true)
    setTimeout(() => setSearchLoading(false), 2000)
  }

  return (
    <section className="demo-section">
      <h2>Search Input Component</h2>
      <p className="demo-description">
        Search input component with various states including loading, filled, folder search, and path
        input. Based on Acronis Design System specifications from Figma.
      </p>

      <div className="demo-grid">
        <div className="demo-item">
          <h3>Basic Search - Inactive</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Default search input with placeholder and search icon.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pr-10 text-sm border-[rgba(38,104,197,0.3)]"
              />
              <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2668C5]" />
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Search - Loading State</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Search input showing loading spinner while processing query.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="search"
                placeholder="Reque"
                value="Reque"
                readOnly
                className="h-8 pr-10 text-sm border-[#2668C5] focus-visible:ring-[#2668C5]"
              />
              <RotateIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#408BEA] animate-spin" />
            </div>
            <Button onClick={handleSearch} size="sm" disabled={searchLoading}>
              {searchLoading ? (
                <>
                  <RotateIcon className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Trigger Search'
              )}
            </Button>
          </div>
        </div>

        <div className="demo-item">
          <h3>Search - Filled with Clear</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Search input with value and clear button to reset.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="search"
                placeholder="Search"
                value={searchFilled}
                onChange={(e) => setSearchFilled(e.target.value)}
                className="h-8 pr-10 text-sm border-[rgba(38,104,197,0.3)]"
              />
              {searchFilled && (
                <button
                  type="button"
                  onClick={() => setSearchFilled('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2668C5] hover:text-[#1a4d8f] transition-colors"
                  aria-label="Clear search"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Search with Folder - Inactive</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Search input with &quot;In folder&quot; action and divider.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="search"
                placeholder="Search"
                value={searchWithFolder}
                onChange={(e) => setSearchWithFolder(e.target.value)}
                className="h-8 pr-[140px] text-sm border-[rgba(38,104,197,0.3)]"
              />
              <div className="absolute right-0 top-0 h-full flex items-center gap-4 pr-3">
                <span className="text-sm font-semibold text-[#243143]">In folder</span>
                <div className="h-full w-px bg-[rgba(38,104,197,0.3)]" />
                <SearchIcon className="h-4 w-4 text-[#2668C5]" />
              </div>
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Search with Folder - Loading</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Folder search showing loading state with focused border.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="search"
                placeholder="Reque"
                value="Reque"
                readOnly
                className="h-8 pr-[140px] text-sm border-[#2668C5] focus-visible:ring-[#2668C5]"
              />
              <div className="absolute right-0 top-0 h-full flex items-center gap-4 pr-3">
                <span className="text-sm font-semibold text-[#243143]">In folder</span>
                <div className="h-full w-px bg-[#2668C5]" />
                <RotateIcon className="h-4 w-4 text-[#408BEA] animate-spin" />
              </div>
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Search with Folder - Filled</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Folder search with value and clear button.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="search"
                placeholder="Search"
                value="Request"
                readOnly
                className="h-8 pr-[140px] text-sm border-[rgba(38,104,197,0.3)]"
              />
              <div className="absolute right-0 top-0 h-full flex items-center gap-4 pr-3">
                <span className="text-sm font-semibold text-[#243143]">In folder</span>
                <div className="h-full w-px bg-[rgba(38,104,197,0.3)]" />
                <button
                  type="button"
                  className="text-[#2668C5] hover:text-[#1a4d8f] transition-colors"
                  aria-label="Clear search"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Search with Folder Selector</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Search with dropdown to select folder scope.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="search"
                placeholder="Search"
                className="h-8 pr-[160px] text-sm border-[rgba(38,104,197,0.3)]"
              />
              <div className="absolute right-0 top-0 h-full flex items-center gap-2 pr-3">
                <button className="flex items-center gap-1 text-sm font-normal text-[#2668C5] hover:text-[#1a4d8f]">
                  In folder
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
                <div className="h-full w-px bg-[rgba(38,104,197,0.3)]" />
                <SearchIcon className="h-4 w-4 text-[#2668C5]" />
              </div>
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Folder Path Input - Inactive</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Path input for specifying folder location.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="text"
                placeholder="Path to folder"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                className="h-8 pr-10 text-sm border-[rgba(38,104,197,0.3)]"
              />
              <ArrowRightIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2668C5]" />
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Folder Path Input - Loading</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Path input showing loading state while validating path.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="text"
                placeholder="C:\\Windo"
                value="C:\\Windo"
                readOnly
                className="h-8 pr-10 text-sm border-[#2668C5] focus-visible:ring-[#2668C5]"
              />
              <RotateIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#408BEA] animate-spin" />
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Folder Path Input - Filled</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Path input with value and clear button.
          </p>
          <div className="space-y-4">
            <div className="relative w-56">
              <Input
                type="text"
                placeholder="Path to folder"
                value={folderPathFilled}
                onChange={(e) => setFolderPathFilled(e.target.value)}
                className="h-8 pr-10 text-sm border-[rgba(38,104,197,0.3)]"
              />
              {folderPathFilled && (
                <button
                  type="button"
                  onClick={() => setFolderPathFilled('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2668C5] hover:text-[#1a4d8f] transition-colors"
                  aria-label="Clear path"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="demo-item">
          <h3>Design Specifications</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Key design tokens and specifications from Figma.
          </p>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="font-semibold">Height:</strong> 32px (fixed)
            </div>
            <div>
              <strong className="font-semibold">Padding:</strong> 16px horizontal
            </div>
            <div>
              <strong className="font-semibold">Border Radius:</strong> 4px
            </div>
            <div>
              <strong className="font-semibold">Icon Size:</strong> 16×16px
            </div>
            <div>
              <strong className="font-semibold">Gap:</strong> 16px between elements
            </div>
            <div>
              <strong className="font-semibold">Border Default:</strong> rgba(38, 104, 197, 0.3)
            </div>
            <div>
              <strong className="font-semibold">Border Focus:</strong> #2668C5
            </div>
            <div>
              <strong className="font-semibold">Icon Color:</strong> #2668C5 (Technical/fixed-link)
            </div>
            <div>
              <strong className="font-semibold">Loading Color:</strong> #408BEA (Nav/brand-secondary)
            </div>
            <div>
              <strong className="font-semibold">Typography:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>Input text: Inter Regular, 14px, 24px line-height</li>
                <li>Action text: Inter Semi Bold, 14px, 24px line-height</li>
                <li>Placeholder: rgba(36, 49, 67, 0.7)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
