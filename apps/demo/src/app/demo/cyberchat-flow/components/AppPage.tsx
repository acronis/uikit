import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatFlowStore } from '../store/useChatFlowStore'
import { ChatHeader } from './ChatHeader'
import { Sidebar } from './Sidebar'
import { LandingState } from './LandingState'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'

export function AppPage() {
  const navigate = useNavigate()
  const isAuthenticated = useChatFlowStore((state) => state.isAuthenticated)
  const messages = useChatFlowStore((state) => state.messages)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/demo/cyberchat-flow')
    }
  }, [isAuthenticated, navigate])

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Only show sidebar when there are messages */}
      {hasMessages && <Sidebar />}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatHeader hasMessages={hasMessages} />

        {/* Content - either landing or messages */}
        {hasMessages ? (
          <>
            <ChatMessages />
            <ChatInput />
          </>
        ) : (
          <LandingState />
        )}
      </div>
    </div>
  )
}
