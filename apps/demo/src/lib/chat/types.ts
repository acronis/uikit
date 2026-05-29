// Chat Feature Type Definitions

export type BotMode = 'eliza' | 'hal9000' | 'conversation'

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type: 'text' | 'question'
  options?: string[]
  metadata?: {
    botMode?: BotMode
    processingTime?: number
  }
}

export interface BotConfig {
  id: BotMode
  name: string
  description: string
  avatar?: string
  responseDelay: {
    min: number
    max: number
  }
}

export interface ChatState {
  messages: ChatMessage[]
  botMode: BotMode
  isTyping: boolean
  inputMode: 'edit' | 'preview'
  userInput: string
  error?: string
  metadata: {
    sessionId: string
    lastActivity: Date
    messageCount: number
  }
}

export type ChatAction =
  | { type: 'SEND_MESSAGE'; payload: string }
  | { type: 'RECEIVE_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_BOT_MODE'; payload: BotMode }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_INPUT_MODE'; payload: 'edit' | 'preview' }
  | { type: 'SET_USER_INPUT'; payload: string }
  | { type: 'ANSWER_QUESTION'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'LOAD_SESSION'; payload: ChatState }
  | { type: 'CLEAR_SESSION' }

export interface ChatSessionStorage {
  version: '1.0'
  state: ChatState
  timestamp: number
}

export interface BotService {
  generateResponse(message: string, context: ChatMessage[]): Promise<string>
  shouldAskQuestion(message: string): boolean
  generateQuestion(): { text: string; options: string[] }
  getConfig(): BotConfig
}

export interface StorageService {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
  isAvailable(): boolean
}

export interface ChatService {
  sendMessage(content: string): Promise<ChatMessage>
  getMessages(): ChatMessage[]
  clearMessages(): void
  setBotMode(mode: BotMode): void
  getBotMode(): BotMode
  getAvailableBots(): BotConfig[]
  saveSession(): void
  loadSession(): boolean
  clearSession(): void
  subscribe(listener: (state: ChatState) => void): () => void
  getState(): ChatState
  answerQuestion(option: string): Promise<void>
}

export interface ChatContainerProps {
  layout?: 'full' | 'dialog' | 'popover'
  className?: string
  onMessageSent?: (message: ChatMessage) => void
  onModeChange?: (mode: BotMode) => void
  initialMode?: BotMode
  maxHeight?: number
}

export interface MessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
  className?: string
  autoScroll?: boolean
  loadingComponent?: React.ComponentType
  messageComponent?: React.ComponentType<{ message: ChatMessage }>
}

export interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
  disabled?: boolean
  maxLength?: number
  placeholder?: string
  showPreview?: boolean
  onPreviewToggle?: () => void
}

export interface TypingIndicatorProps {
  className?: string
  botMode?: BotMode
}

export interface BotModeSelectorProps {
  currentMode: BotMode
  onModeChange: (mode: BotMode) => void
  className?: string
}
