import { ChatState, ChatSessionStorage } from './types'

const STORAGE_KEY = 'chat-session'
const STORAGE_VERSION = '1.0'

export const StorageService: import('./types').StorageService = {
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      if (!item) return null

      const parsed = JSON.parse(item)

      // Handle versioned storage
      if (key === STORAGE_KEY && parsed.version !== STORAGE_VERSION) {
        this.remove(key)
        return null
      }

      return parsed as T
    } catch (error) {
      console.warn('Failed to get from storage:', error)
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      if (!this.isAvailable()) {
        console.warn('Session storage not available')
        return
      }

      const serialized = JSON.stringify(value)
      sessionStorage.setItem(key, serialized)
    } catch (error) {
      console.warn('Failed to set to storage:', error)
    }
  },

  remove(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from storage:', error)
    }
  },

  clear(): void {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.warn('Failed to clear storage:', error)
    }
  },

  isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      sessionStorage.setItem(test, test)
      sessionStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },
}

// Chat-specific storage helpers
export const ChatStorage = {
  save(state: ChatState): void {
    const sessionData: ChatSessionStorage = {
      version: STORAGE_VERSION,
      state,
      timestamp: Date.now(),
    }
    StorageService.set(STORAGE_KEY, sessionData)
  },

  load(): ChatState | null {
    const sessionData = StorageService.get<ChatSessionStorage>(STORAGE_KEY)
    if (!sessionData) return null

    // Convert string timestamps back to Date objects
    const state = sessionData.state
    state.messages = state.messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }))
    state.metadata.lastActivity = new Date(state.metadata.lastActivity)

    return state
  },

  clear(): void {
    StorageService.remove(STORAGE_KEY)
  },

  isAvailable(): boolean {
    return StorageService.isAvailable()
  },
}
