import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../lib/chat/chat-service';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { BotModeSelector } from './BotModeSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react';
import { Separator } from '@acronis-platform/shadcn-uikit/react';
import { BotMode } from '../../lib/chat/types';

interface ChatInterfaceProps {
  onMessageSent?: (message: any) => void;
  onModeChange?: (mode: BotMode) => void;
  initialMode?: BotMode;
}

export function ChatInterface({
  onMessageSent,
  onModeChange,
  // initialMode = 'hal9000'
}: ChatInterfaceProps) {
  const {
    sendMessage,
    getMessages,
    setBotMode,
    // getBotMode,
    getState,
    answerQuestion,
    subscribe
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Set initial bot mode
  // useEffect(() => {
  //   if (initialMode !== getBotMode()) {
  //     setBotMode(initialMode);
  //   }
  // }, [initialMode, setBotMode]); // Remove getBotMode from dependencies

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [getMessages()]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      setError(null);
      const message = await sendMessage(content);
      setInputValue('');
      setIsPreview(false);
      onMessageSent?.(message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const handleAnswerQuestion = async (option: string) => {
    try {
      setError(null);
      await answerQuestion(option);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to answer');
    }
  };

  const handleModeChange = (mode: BotMode) => {
    setBotMode(mode);
    onModeChange?.(mode);
  };

  const [state, setState] = useState(getState());

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, [subscribe]);

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Chat Demo</CardTitle>
          <BotModeSelector
            currentMode={state.botMode}
            onModeChange={handleModeChange}
          />
        </div>
      </CardHeader>

      <Separator className="flex-shrink-0" />

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <MessageList
            messages={state.messages}
            isTyping={state.isTyping}
            onAnswerQuestion={handleAnswerQuestion}
            className=""
          />
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm flex-shrink-0">
            {error}
          </div>
        )}

        <div className="border-t p-4 flex-shrink-0">
          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            disabled={state.isTyping}
            maxLength={500}
            showPreview={isPreview}
            onPreviewToggle={() => setIsPreview(!isPreview)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
