import React from 'react';
import { ChatProvider } from '../lib/chat/chat-service';
import { ChatContainer } from '../components/chat/ChatContainer';

export function ChatPage() {
  return (
    <div className="container mx-auto py-8 h-full">
      <ChatProvider>
        <ChatContainer layout="full" />
      </ChatProvider>
    </div>
  );
}

export default ChatPage;
