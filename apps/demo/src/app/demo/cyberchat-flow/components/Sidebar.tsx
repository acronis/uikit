import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { SearchIcon, PlusIcon } from '@acronis-platform/shadcn-uikit'
import { ScrollArea } from '@acronis-platform/shadcn-uikit/react'

const mockChats = [
  { id: '1', title: 'Show me what you can', active: true },
  { id: '2', title: 'Customer feedback triage', active: false },
  { id: '3', title: 'Sales follow-up', active: false },
  { id: '4', title: 'Marketing campaign strategy', active: false },
  { id: '5', title: 'Feature demo', active: false },
]

export function Sidebar() {
  return (
    <div className="w-64 border-r border-border bg-background flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Recent chats */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-medium">Recent chats</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {mockChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    chat.active
                      ? 'bg-muted font-medium'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
