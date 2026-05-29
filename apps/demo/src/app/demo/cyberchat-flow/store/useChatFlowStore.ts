import { create } from 'zustand'
import type { ChatFlowState, ChatFlowActions, Message } from '../types'
import { suggestionChips } from '../data/suggestions'

type ChatFlowStore = ChatFlowState & ChatFlowActions

export const useChatFlowStore = create<ChatFlowStore>()((set, get) => ({
  // Initial state
  isAuthenticated: false,
  messages: [],
  isTyping: false,
  inputValue: '',
  webSearchEnabled: false,
  selectedModel: 'ChatGPT 5.2',
  suggestionChips,

  // Auth actions
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, messages: [] }),

  // Input actions
  setInputValue: (value) => set({ inputValue: value }),

  selectSuggestion: (text) => {
    set({ inputValue: text })
  },

  toggleWebSearch: () =>
    set((state) => ({ webSearchEnabled: !state.webSearchEnabled })),

  setSelectedModel: (modelId) => set({ selectedModel: modelId }),

  // Send message
  sendMessage: async () => {
    const state = get()
    if (!state.inputValue.trim()) return

    const userInput = state.inputValue

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date(),
    }

    set({
      messages: [...state.messages, userMessage],
      inputValue: '',
      isTyping: true,
    })

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        type: 'ai',
        content: `Lorem Ipsum is bold dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's underline dummy text ever since the 1500s, italic when an unknown printer took a galley of type and scrambled it to make a type specimen book.

Printing and typesetting industry. Lorem Ipsum has been the industry's underline dummy text ever since the 1500s, italic when an unknown printer took a galley of type and scrambled. Lorem Ipsum is bold dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's underline dummy text ever since the 1500s, italic when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        timestamp: new Date(),
      }

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isTyping: false,
      }))
    }, 1500)
  },
}))