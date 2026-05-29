import { ClockIcon } from '@acronis-platform/shadcn-uikit'
import type { Chat } from '../types'
import { formatRelativeTime } from '../utils/dateUtils'

interface ChatListItemProps {
  chat: Chat
  isActive: boolean
  onClick: () => void
}

export function ChatListItem({ chat, isActive, onClick }: ChatListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2 rounded-md text-sm transition-colors relative
        ${isActive ? 'bg-accent/70 text-accent-foreground' : 'hover:bg-accent/50'}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="font-normal truncate pr-2">{chat.title}</span>
        {chat.hasAlert && (
          <ClockIcon
            className={`
              h-4 w-4 flex-shrink-0 text-destructive
              animate-pulse
            `}
          />
        )}
      </div>
      {chat.preview && (
        <p className="text-xs text-muted-foreground truncate mt-1">
          {chat.preview}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        {formatRelativeTime(chat.lastActivity)}
      </p>
    </button>
  )
}
