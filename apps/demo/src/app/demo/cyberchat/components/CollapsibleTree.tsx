import { ChevronDownIcon, ChevronRightIcon } from '@acronis-platform/shadcn-uikit'
import type { Project } from '../types'

interface CollapsibleTreeProps {
  items: Project[]
  expandedIds: string[]
  onToggle: (id: string) => void
  searchQuery?: string
  level?: number
}

export function CollapsibleTree({
  items,
  expandedIds,
  onToggle,
  searchQuery = '',
  level = 0,
}: CollapsibleTreeProps) {
  const hasSearchQuery = searchQuery.trim().length > 0

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id)
        const hasChildren = item.children && item.children.length > 0
        const shouldShowChildren = isExpanded || hasSearchQuery

        return (
          <div key={item.id}>
            <button
              onClick={() => hasChildren && onToggle(item.id)}
              className={`
                w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                flex items-center gap-2
                ${level > 0 ? 'ml-4 text-foreground/60' : 'text-foreground'}
                hover:bg-accent/50
              `}
            >
              {hasChildren && (
                <span className="flex-shrink-0">
                  {isExpanded && !hasSearchQuery ? (
                    <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 transition-transform duration-200" />
                  )}
                </span>
              )}
              {!hasChildren && <span className="w-4" />}
              <span className="truncate flex-1">{item.name}</span>
            </button>

            {hasChildren && shouldShowChildren && (
              <div
                className={`
                  overflow-hidden transition-all duration-200
                  ${shouldShowChildren ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <CollapsibleTree
                  items={item.children!}
                  expandedIds={expandedIds}
                  onToggle={onToggle}
                  searchQuery={searchQuery}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
