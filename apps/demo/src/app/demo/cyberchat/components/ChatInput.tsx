import { useEffect, useRef, useState } from 'react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { SendIcon, FileTextIcon, GlobeIcon, CloseIcon } from '@acronis-platform/shadcn-uikit'
import { BrainIcon } from '@/components/icons/missing-icons'
import { toast } from 'sonner'
import { useCyberChatStore } from '../store/useCyberChatStore'
import { ModelSelector } from './ModelSelector'

export function ChatInput() {
  const {
    inputValue,
    setInputValue,
    deepResearchEnabled,
    webSearchEnabled,
    toggleDeepResearch,
    toggleWebSearch,
    sendMessage,
    attachedFiles,
    addAttachedFile,
    removeAttachedFile,
  } = useCyberChatStore()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 200)
      textarea.style.height = `${newHeight}px`
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 10MB)`)
      } else {
        addAttachedFile(file)
        toast.success(`Added ${file.name}`)
      }
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 10MB)`)
      } else {
        addAttachedFile(file)
        toast.success(`Added ${file.name}`)
      }
    })
  }

  return (
    <div className="p-6 border-t border-border/50 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Attached Files */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
              >
                <FileTextIcon className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{file.name}</span>
                <button
                  onClick={() => removeAttachedFile(index)}
                  className="hover:text-destructive transition-colors"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Container */}
        <div
          className={`relative border rounded-2xl bg-background p-3 transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            className="w-full min-h-[64px] max-h-[200px] resize-none bg-transparent text-sm focus:outline-none"
            rows={1}
          />

          <div className="flex items-center justify-between mt-2">
            {/* Left side - Mode toggles */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
              >
                <FileTextIcon className="h-5 w-5" />
              </Button>
              <Button
                variant={deepResearchEnabled ? 'default' : 'outline'}
                size="icon"
                className="h-9 w-9"
                onClick={toggleDeepResearch}
                title="Deep research mode"
              >
                <BrainIcon className="h-5 w-5" />
              </Button>
              <Button
                variant={webSearchEnabled ? 'default' : 'outline'}
                size="icon"
                className="h-9 w-9"
                onClick={toggleWebSearch}
                title="Web search mode"
              >
                <GlobeIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Right side - Model selector and send */}
            <div className="flex items-center gap-2">
              <ModelSelector />
              <Button
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl pointer-events-none">
            <p className="text-sm text-muted-foreground">Drop files here</p>
          </div>
        )}
      </div>
    </div>
  )
}
