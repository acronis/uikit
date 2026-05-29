import { useRef, useEffect } from 'react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { GlobeIcon } from '@acronis-platform/shadcn-uikit'
import { PaperclipIcon } from '@/components/icons/missing-icons'
import { useChatFlowStore } from '../store/useChatFlowStore'

export function ChatInput() {
  const inputValue = useChatFlowStore((state) => state.inputValue)
  const setInputValue = useChatFlowStore((state) => state.setInputValue)
  const sendMessage = useChatFlowStore((state) => state.sendMessage)
  const webSearchEnabled = useChatFlowStore((state) => state.webSearchEnabled)
  const toggleWebSearch = useChatFlowStore((state) => state.toggleWebSearch)
  const selectedModel = useChatFlowStore((state) => state.selectedModel)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 200)
      textarea.style.height = `${newHeight}px`
    }
  }, [inputValue])

  // Focus input when suggestion is selected
  useEffect(() => {
    if (inputValue && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [inputValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage()
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  return (
    <div className="border-t border-border bg-background px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative border rounded-3xl bg-white px-5 py-4 transition-colors ${
            inputValue ? 'border-[#0D7DE5]' : 'border-gray-200'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            className="w-full min-h-[80px] max-h-[200px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground mb-4"
            rows={1}
          />

          <div className="flex items-center justify-between">
            {/* Left side - Add files and Web search */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-xl text-sm border-gray-200 bg-white hover:bg-gray-50"
              >
                <PaperclipIcon className="h-4 w-4" />
                <span>Add files</span>
              </Button>
              <Button
                variant={webSearchEnabled ? 'default' : 'outline'}
                size="sm"
                className={`h-9 gap-2 rounded-xl text-sm ${
                  webSearchEnabled
                    ? 'bg-[#0D7DE5] hover:bg-[#0B6FD1] text-white border-[#0D7DE5]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
                onClick={toggleWebSearch}
              >
                <GlobeIcon className="h-4 w-4" />
                <span>Web search</span>
              </Button>
            </div>

            {/* Right side - Model selector and send */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-9 gap-2 rounded-xl text-sm border-gray-200 bg-white hover:bg-gray-50"
              >
                <span>{selectedModel}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
              <Button
                size="icon"
                className="h-9 w-9 rounded-xl bg-[#0D7DE5] hover:bg-[#0B6FD1]"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3L8 13M8 3L5 6M8 3L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
