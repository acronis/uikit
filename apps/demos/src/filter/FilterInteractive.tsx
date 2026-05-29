import * as React from 'react'
import { Filter } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Card, CardContent, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'

export function FilterInteractive() {
  const [activeFilters, setActiveFilters] = React.useState<string[]>([])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    )
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product List</span>
          <div className="flex gap-2">
            <Filter count={activeFilters.length} active={activeFilters.length > 0}>
              Filters
            </Filter>
            {activeFilters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Quick Filters</h4>
            <div className="flex gap-2 flex-wrap">
              {['New', 'Popular', 'On Sale', 'In Stock', 'Featured'].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilters.includes(filter) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
          {activeFilters.length > 0 && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Active Filters:</strong> {activeFilters.join(', ')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
