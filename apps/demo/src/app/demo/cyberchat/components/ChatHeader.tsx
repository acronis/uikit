import { Button, Switch } from '@acronis-platform/shadcn-uikit/react'
import { ChevronDownIcon } from '@acronis-platform/shadcn-uikit'
import { useCyberChatStore } from '../store/useCyberChatStore'
import { ThemeSwitcher } from '@/components/playground/ThemeSwitcher'
import { TokenSelector } from '@/components/playground/TokenSelector'

export function ChatHeader() {
  const {
    activeChat,
    chats,
    tempChatEnabled,
    setTempChatEnabled,
    shareDropdownOpen,
    toggleShareDropdown,
  } = useCyberChatStore()

  const currentChat = chats.find((chat) => chat.id === activeChat)
  const chatTitle = currentChat?.title || 'Chat'

  return (
    <div className="h-14 border-b border-border/50 px-6 flex items-center justify-between bg-background">
      <h1 className="text-base font-semibold">{chatTitle}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={tempChatEnabled}
            onCheckedChange={setTempChatEnabled}
            className="scale-90"
          />
          <span className="text-sm">Temporary chat</span>
        </div>
        <TokenSelector />
        <ThemeSwitcher variant="dropdown" size="sm" />
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleShareDropdown}
          >
            Share & Export
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
          {shareDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors">
                Export as PDF
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors">
                Export as Markdown
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors">
                Copy link
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors">
                Share via email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
