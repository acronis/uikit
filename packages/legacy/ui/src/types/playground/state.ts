import { Theme } from './theme'
import { TokenSet } from './tokens'

/**
 * UI state for playground interface
 */
export interface UIState {
  tokenEditorOpen: boolean
  showcaseMode: 'grid' | 'detail'
  selectedComponent?: string
  searchQuery: string
  filterCategory?: string
}

/**
 * User preferences
 */
export interface Preferences {
  autoApplyChanges: boolean
  showCodeSnippets: boolean
  viewportSize: 'mobile' | 'tablet' | 'desktop'
}

/**
 * Complete playground state
 */
export interface PlaygroundState {
  theme: Theme
  activeTokenSetId: string
  tokenSets: Record<string, TokenSet>
  customTokenSet?: TokenSet
  ui: UIState
  preferences: Preferences
}
