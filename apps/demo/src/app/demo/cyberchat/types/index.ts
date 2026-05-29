export interface Chat {
  id: string
  title: string
  hasAlert: boolean
  lastActivity: Date
  preview?: string
}

export interface Project {
  id: string
  name: string
  children?: Project[]
  expanded: boolean
}

export interface Skill {
  id: string
  name: string
  children?: Skill[]
  expanded: boolean
}

export interface Message {
  id: string
  type: 'user' | 'ai' | 'loading'
  content: string | TableData
  timestamp: Date
  actions?: MessageAction[]
  badges?: MessageBadge[]
}

export interface TableData {
  headers: string[]
  rows: TableRow[]
}

export interface TableRow {
  [key: string]: string | number
}

export interface MessageAction {
  type: 'copy' | 'like' | 'dislike' | 'share' | 'regenerate' | 'more'
  label: string
  active?: boolean
}

export interface MessageBadge {
  text: string
  variant?: 'default' | 'outline' | 'secondary'
}

export interface AIModel {
  id: string
  name: string
  tier: 'auto' | 'premium' | 'default'
  usage?: number
  usageColor?: 'green' | 'yellow' | 'red'
}

export interface CyberChatState {
  // Sidebar
  searchQuery: string
  expandedProjects: string[]
  expandedSkills: string[]
  activeChat: string
  chats: Chat[]
  projects: Project[]
  skills: Skill[]

  // Main area
  messages: Message[]
  isTyping: boolean
  tempChatEnabled: boolean

  // Input
  inputValue: string
  attachedFiles: File[]
  deepResearchEnabled: boolean
  webSearchEnabled: boolean
  selectedModel: string
  autoModelEnabled: boolean
  models: AIModel[]

  // UI
  modelDropdownOpen: boolean
  shareDropdownOpen: boolean
}

export interface CyberChatActions {
  // Sidebar actions
  setSearchQuery: (query: string) => void
  toggleProjectExpanded: (projectId: string) => void
  toggleSkillExpanded: (skillId: string) => void
  setActiveChat: (chatId: string) => void
  addChat: (chat: Chat) => void
  addProject: (project: Project) => void
  addSkill: (skill: Skill) => void

  // Message actions
  addMessage: (message: Message) => void
  setIsTyping: (isTyping: boolean) => void
  toggleMessageAction: (messageId: string, actionType: string) => void

  // Input actions
  setInputValue: (value: string) => void
  addAttachedFile: (file: File) => void
  removeAttachedFile: (index: number) => void
  clearAttachedFiles: () => void
  toggleDeepResearch: () => void
  toggleWebSearch: () => void
  setSelectedModel: (modelId: string) => void
  toggleAutoModel: () => void

  // UI actions
  toggleModelDropdown: () => void
  toggleShareDropdown: () => void
  setTempChatEnabled: (enabled: boolean) => void

  // Complex actions
  sendMessage: () => void
  switchChat: (chatId: string) => void
  regenerateMessage: (messageId: string) => void
}
