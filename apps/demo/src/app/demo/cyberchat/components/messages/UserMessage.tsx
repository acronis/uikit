import type { Message } from '../../types'
import { formatMessageTime } from '../../utils/dateUtils'

interface UserMessageProps {
  message: Message
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-[80%]">
        <div className="bg-primary/5 border border-border rounded-2xl px-4 py-3">
          <p className="text-sm leading-6 whitespace-pre-wrap text-foreground">{message.content as string}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}
