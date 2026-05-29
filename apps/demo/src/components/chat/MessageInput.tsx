import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { MessageInputProps } from '@/lib/chat/types';
import { Button } from '@acronis-platform/shadcn-uikit/react';
import { Textarea } from '@acronis-platform/shadcn-uikit/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@acronis-platform/shadcn-uikit/react';
import { SendIcon, ShowIcon, HideIcon } from '@acronis-platform/shadcn-uikit';
import { SmileIcon } from '@/components/icons/missing-icons';

export function MessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
  maxLength = 500,
  placeholder = "Type your message...",
  showPreview = false,
  onPreviewToggle
}: MessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const newValue = value + emoji.emoji;
    onChange(newValue);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.9;
  const isAtLimit = characterCount >= maxLength;

  return (
    <div className="space-y-2">
      {showPreview ? (
        <div className="min-h-[100px] max-h-[300px] overflow-y-auto p-3 border rounded-md bg-muted/50">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || '*Nothing to preview*'}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[100px] max-h-[300px] resize-none pr-24"
            rows={3}
          />

          <div className="absolute bottom-2 right-2 flex gap-1">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={disabled}
                  />
                }
              >
                <SmileIcon className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  theme={Theme.LIGHT}
                  width={320}
                  height={400}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviewToggle}
            className="h-8"
          >
            {showPreview ? (
              <>
                <HideIcon className="h-3 w-3 mr-1" />
                Edit
              </>
            ) : (
              <>
                <ShowIcon className="h-3 w-3 mr-1" />
                Preview
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs',
            isNearLimit && !isAtLimit && 'text-yellow-600',
            isAtLimit && 'text-red-600'
          )}>
            {characterCount}/{maxLength}
          </span>

          <Button
            onClick={handleSend}
            disabled={!value.trim() || disabled || isAtLimit}
            size="sm"
            className="h-8"
          >
            <SendIcon className="h-3 w-3 mr-1" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
