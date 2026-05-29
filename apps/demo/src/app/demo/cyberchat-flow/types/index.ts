export interface SuggestionChip {
  id: string
  text: string
}

export interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export interface ChatFlowState {
  // Auth
  isAuthenticated: boolean

  // Messages
  messages: Message[]
  isTyping: boolean

  // Input
  inputValue: string
  webSearchEnabled: boolean
  selectedModel: string

  // UI
  suggestionChips: SuggestionChip[]
}

export interface ChatFlowActions {
  // Auth
  login: () => void
  logout: () => void

  // Messages
  sendMessage: () => void
  setInputValue: (value: string) => void
  selectSuggestion: (text: string) => void

  // UI
  toggleWebSearch: () => void
  setSelectedModel: (modelId: string) => void
}