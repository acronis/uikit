import { ThemeMode, PlaygroundState } from '@/types/playground'

/**
 * Default playground state
 */
export const DEFAULT_STATE: PlaygroundState = {
  theme: {
    mode: ThemeMode.SYSTEM,
  },
  activeTokenSetId: 'default',
  tokenSets: {},
  ui: {
    tokenEditorOpen: false,
    showcaseMode: 'grid',
    searchQuery: '',
  },
  preferences: {
    autoApplyChanges: true,
    showCodeSnippets: true,
    viewportSize: 'desktop',
  },
}
