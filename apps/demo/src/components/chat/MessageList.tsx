import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { MessageListProps } from '../../lib/chat/types';
import { useChat } from '../../lib/chat/chat-service';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@acronis-platform/shadcn-uikit/react';

interface MessageListPropsExtended extends MessageListProps {
  onAnswerQuestion?: (option: string) => void;
}

export function MessageList({
  messages,
  isTyping,
  className,
  onAnswerQuestion
}: MessageListPropsExtended) {
  const { getBotMode } = useChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleOptionClick = (option: string) => {
    onAnswerQuestion?.(option);
  };

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex',
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <div
            className={cn(
              'max-w-[80%] rounded-lg px-4 py-2',
              message.sender === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            {message.sender === 'bot' && message.metadata?.botMode && (
              <div className="text-xs font-semibold mb-1 opacity-70">
                {message.metadata.botMode === 'eliza' ? '🧑‍⚕️ ELIZA' : '🔴 HAL 9000'}
              </div>
            )}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>

            {message.type === 'question' && message.options && (
              <div className="mt-3 space-y-2">
                {message.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleOptionClick(option)}
                    className="w-full justify-start text-left"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            <div className="text-xs opacity-70 mt-1">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg px-4 py-2">
            <TypingIndicator botMode={getBotMode()} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
