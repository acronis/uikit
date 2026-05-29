import React from 'react';
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { TypingIndicatorProps } from '@/lib/chat/types';

export function TypingIndicator({ className, botMode }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm text-muted-foreground ml-2">
        {botMode === 'eliza' ? 'ELIZA is typing...' : 'HAL is processing...'}
      </span>
    </div>
  );
}
