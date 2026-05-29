import * as React from 'react'
import { AutoIcons } from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { SearchIcon } from '@acronis-platform/shadcn-uikit'
export function IconsDemo() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const iconEntries = Object.entries(AutoIcons)

  const filteredIcons = iconEntries.filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="demo-section">
      <h2>Icons Library</h2>
      <p className="demo-description">
        All {iconEntries.length} auto-generated icons from the Acronis design system.
      </p>

      <div className="space-y-6">
        <div className="sticky top-0 z-10 bg-background pb-4">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {filteredIcons.length} of {iconEntries.length} icons
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredIcons.map(([name, IconComponent]) => (
            <div
              key={name}
              className="flex flex-col items-center gap-3 p-4 border rounded-lg hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => {
                navigator.clipboard.writeText(name)
              }}
              title={`Click to copy: ${name}`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                <IconComponent className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-xs font-mono text-muted-foreground break-all leading-tight">
                  {name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground mb-2">No icons found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
          </div>
        )}

        <div className="mt-8 p-6 border rounded-lg bg-muted/30">
          <h3 className="text-lg font-semibold mb-4">Usage</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Import specific icon:</h4>
              <pre className="bg-background p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`import { SuccessIcon, DangerIcon } from '@/components/icons/auto-generated'

<SuccessIcon className="w-6 h-6" />
<DangerIcon className="w-6 h-6 text-red-500" />`}
                </code>
              </pre>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Import all icons:</h4>
              <pre className="bg-background p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`import { AutoIcons } from '@/components/icons/auto-generated'

const IconComponent = AutoIcons['success']
<IconComponent className="w-6 h-6" />`}
                </code>
              </pre>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Dynamic icon rendering:</h4>
              <pre className="bg-background p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`import { AutoIcons } from '@/components/icons/auto-generated'

const iconName = 'success'
const Icon = AutoIcons[iconName]

{Icon && <Icon className="w-6 h-6" />}`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 border-l-4 border-primary bg-primary/5 rounded">
          <p className="text-sm">
            <strong>💡 Tip:</strong> Click on any icon to copy its name to clipboard
          </p>
        </div>
      </div>
    </section>
  )
}
