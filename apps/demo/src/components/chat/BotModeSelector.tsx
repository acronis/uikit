import React from 'react';
import { BotModeSelectorProps, BotMode } from '@/lib/chat/types';
import { Button } from '@acronis-platform/shadcn-uikit/react';
import { cn } from '@acronis-platform/shadcn-uikit/react'

const BOT_INFO = {
  eliza: {
    name: 'ELIZA',
    avatar: '🧑‍⚕️',
    description: 'Classic psychotherapist'
  },
  hal9000: {
    name: 'HAL 9000',
    avatar: '🔴',
    description: '2001: A Space Odyssey AI'
  },
  conversation: {
    name: 'ELIZA ↔ HAL',
    avatar: '💬',
    description: 'Watch them talk'
  }
};

export function BotModeSelector({
  currentMode,
  onModeChange,
  className
}: BotModeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">Bot:</span>
      <div className="flex gap-1">
        {(Object.keys(BOT_INFO) as BotMode[]).map((mode) => (
          <Button
            key={mode}
            variant={currentMode === mode ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange(mode)}
            className="h-8 px-3"
          >
            <span className="mr-1">{BOT_INFO[mode].avatar}</span>
            {BOT_INFO[mode].name}
          </Button>
        ))}
      </div>
    </div>
  );
}
