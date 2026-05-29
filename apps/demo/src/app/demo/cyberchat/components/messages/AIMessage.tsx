import { Badge } from '@acronis-platform/shadcn-uikit/react'
import type { Message, TableData } from '../../types'
import { MessageActions } from './MessageActions'
import { DataTable } from '../DataTable'
import { formatMessageTime } from '../../utils/dateUtils'

interface AIMessageProps {
  message: Message
}

export function AIMessage({ message }: AIMessageProps) {
  const isTableData = typeof message.content === 'object' && 'headers' in message.content

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-3">
        {/* Text content */}
        {typeof message.content === 'string' && (
          <div className="text-sm whitespace-pre-wrap">
            {message.content.split('\n').map((line, i) => {
              // Handle bold text with **text**
              if (line.includes('**')) {
                const parts = line.split(/(\*\*.*?\*\*)/)
                return (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {parts.map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <span key={j} className="font-semibold">
                            {part.slice(2, -2)}
                          </span>
                        )
                      }
                      return part
                    })}
                  </p>
                )
              }
              return line ? <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p> : <br key={i} />
            })}
          </div>
        )}

        {/* Table data */}
        {isTableData && <DataTable data={message.content as TableData} />}

        {/* Badges */}
        {message.badges && message.badges.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {message.badges.map((badge, i) => (
              <Badge key={i} variant={badge.variant || 'outline'} className="text-xs">
                {badge.text}
              </Badge>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground">
          {formatMessageTime(message.timestamp)}
        </p>

        {/* Actions */}
        {message.actions && message.actions.length > 0 && (
          <MessageActions messageId={message.id} actions={message.actions} />
        )}
    </div>
  )
}
