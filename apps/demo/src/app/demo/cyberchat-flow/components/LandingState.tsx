import { useRef, useEffect } from 'react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { FileSearchIcon, BrainIcon } from '@/components/icons/missing-icons'
import { useChatFlowStore } from '../store/useChatFlowStore'

export function LandingState() {
  const suggestionChips = useChatFlowStore((state) => state.suggestionChips)
  const selectSuggestion = useChatFlowStore((state) => state.selectSuggestion)
  const selectedModel = useChatFlowStore((state) => state.selectedModel)
  const inputValue = useChatFlowStore((state) => state.inputValue)
  const setInputValue = useChatFlowStore((state) => state.setInputValue)
  const sendMessage = useChatFlowStore((state) => state.sendMessage)

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
    <div className="flex-1 flex items-center justify-center px-6 overflow-auto bg-[#F5F7FA]">
      <div className="max-w-3xl w-full space-y-6">
        {/* Heading */}
        <div>
          <h1 className="text-xl font-normal text-foreground">
            Hey Alex, what are gonna do today?
          </h1>
        </div>

        {/* Input box with buttons inside - centered */}
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

          {/* Buttons inside textarea */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-xl text-sm border-gray-200 bg-white hover:bg-gray-50"
              >
                <FileSearchIcon className="h-4 w-4" />
                <span>Add files</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-xl text-sm border-gray-200 bg-white hover:bg-gray-50"
              >
                <BrainIcon className="h-4 w-4" />
                <span>Web search</span>
              </Button>
            </div>
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

        {/* Not sure where to start section */}
        <div className="space-y-3">
          <h2 className="text-base font-medium text-foreground">Not sure where to start?</h2>

          {/* Suggestion chips - flowing layout */}
          <div className="flex flex-wrap gap-2">
            {suggestionChips.map((chip) => (
              <Button
                key={chip.id}
                variant="outline"
                className="h-auto py-2 px-4 font-normal text-sm rounded-full border-gray-200 bg-white hover:bg-gray-50"
                onClick={() => selectSuggestion(chip.text)}
              >
                {chip.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
