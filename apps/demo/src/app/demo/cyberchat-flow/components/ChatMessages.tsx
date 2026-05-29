import { useEffect, useRef } from 'react'
import { ScrollArea } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { CopyIcon, RotateIcon } from '@acronis-platform/shadcn-uikit'
import { ThumbsUpIcon, ThumbsDownIcon } from '@/components/icons/missing-icons'
import { useChatFlowStore } from '../store/useChatFlowStore'
import type { Message } from '../types'

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end">
      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-2xl">
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  )
}

function AIMessage({ message }: { message: Message }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          AI
        </div>
      </div>
      <div className="flex-1 space-y-3">
        <div className="prose prose-sm max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <CopyIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ThumbsUpIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ThumbsDownIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RotateIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function LoadingMessage() {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          AI
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"></div>
      </div>
    </div>
  )
}

export function ChatMessages() {
  const messages = useChatFlowStore((state) => state.messages)
  const isTyping = useChatFlowStore((state) => state.isTyping)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          {messages.map((message) =>
            message.type === 'user' ? (
              <UserMessage key={message.id} message={message} />
            ) : (
              <AIMessage key={message.id} message={message} />
            )
          )}
          {isTyping && <LoadingMessage />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
