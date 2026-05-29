import React from 'react';
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { ChatContainerProps } from '../../lib/chat/types';
import { ChatInterface } from './ChatInterface';

export function ChatContainer({
  layout = 'full',
  className,
  onMessageSent,
  onModeChange,
  initialMode = 'eliza',
  maxHeight
}: ChatContainerProps) {
  const containerClasses = cn(
    'bg-background border rounded-lg shadow-xs flex flex-col',
    {
      'h-full': layout === 'full',
      'h-96': layout === 'dialog',
      'h-80 max-h-96': layout === 'popover'
    },
    className
  );

  const style = maxHeight ? { maxHeight: `${maxHeight}px` } : undefined;

  return (
    <div className={containerClasses} style={style}>
      <ChatInterface
        onMessageSent={onMessageSent}
        onModeChange={onModeChange}
        initialMode={initialMode}
      />
    </div>
  );
}
