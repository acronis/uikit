import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PlaygroundState, ThemeMode, TokenSet, DeepPartial } from '@/types/playground/index.ts'
import { DEFAULT_STATE, PREDEFINED_TOKEN_SETS } from '@/constants/playground/index.ts'

interface PlaygroundStore extends PlaygroundState {
  // Theme actions
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void

  // Token actions
  setActiveTokenSet: (id: string) => void
  updateCustomTokens: (updates: DeepPartial<TokenSet>) => void
  resetCustomTokens: () => void
  addTokenSet: (tokenSet: TokenSet) => void
  removeTokenSet: (id: string) => void

  // UI actions
  setTokenEditorOpen: (open: boolean) => void
  setShowcaseMode: (mode: 'grid' | 'detail') => void
  setSelectedComponent: (componentId?: string) => void
  setSearchQuery: (query: string) => void
  setFilterCategory: (category?: string) => void

  // Preferences actions
  setAutoApplyChanges: (value: boolean) => void
  setShowCodeSnippets: (value: boolean) => void
  setViewportSize: (size: 'mobile' | 'tablet' | 'desktop') => void

  // Persistence
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
}

const applyThemeToDocument = (mode: ThemeMode) => {
  const root = document.documentElement
  root.classList.remove('light', 'dark')

  if (mode === ThemeMode.SYSTEM) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(mode)
  }
}

// Apply theme immediately on load from localStorage before store initialization
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('playground-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      const themeMode = parsed.state?.theme?.mode
      if (themeMode) {
        applyThemeToDocument(themeMode)
      }
    }
  } catch {
    // Ignore errors, will use default theme
  }
}

export const usePlaygroundStore = create<PlaygroundStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      tokenSets: PREDEFINED_TOKEN_SETS,

      // Theme actions
      setTheme: (mode: ThemeMode) => {
        set({ theme: { mode } })
        applyThemeToDocument(mode)
      },

      toggleTheme: () => {
        const currentMode = get().theme.mode
        let newMode: ThemeMode

        if (currentMode === ThemeMode.LIGHT) {
          newMode = ThemeMode.DARK
        } else if (currentMode === ThemeMode.DARK) {
          newMode = ThemeMode.SYSTEM
        } else {
          newMode = ThemeMode.LIGHT
        }

        get().setTheme(newMode)
      },

      // Token actions
      setActiveTokenSet: (id: string) => {
        set({
          activeTokenSetId: id,
          customTokenSet: undefined, // Clear custom tokens when switching presets
        })
      },

      updateCustomTokens: (updates: DeepPartial<TokenSet>) => {
        const currentCustom = get().customTokenSet
        const activeTokenSet = get().tokenSets[get().activeTokenSetId]

        const baseTokenSet = currentCustom || activeTokenSet

        const mergeDeep = (target: any, source: any): any => {
          const output = { ...target }
          for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
              output[key] = mergeDeep(target[key] || {}, source[key])
            } else {
              output[key] = source[key]
            }
          }
          return output
        }

        const updatedTokenSet: TokenSet = mergeDeep(baseTokenSet, updates)

        if (!updatedTokenSet.id) {
          updatedTokenSet.id = 'custom'
          updatedTokenSet.name = 'Custom'
        }

        set({
          customTokenSet: updatedTokenSet,
          activeTokenSetId: 'custom',
        })
      },

      resetCustomTokens: () => {
        set({
          customTokenSet: undefined,
          activeTokenSetId: 'default',
        })
      },

      addTokenSet: (tokenSet: TokenSet) => {
        set((state) => ({
          tokenSets: {
            ...state.tokenSets,
            [tokenSet.id]: tokenSet,
          },
        }))
      },

      removeTokenSet: (id: string) => {
        if (id === 'default') return

        set((state) => {
          const { [id]: _removed, ...rest } = state.tokenSets
          return {
            tokenSets: rest,
            activeTokenSetId: state.activeTokenSetId === id ? 'default' : state.activeTokenSetId,
          }
        })
      },

      // UI actions
      setTokenEditorOpen: (open: boolean) => {
        set((state) => ({
          ui: { ...state.ui, tokenEditorOpen: open },
        }))
      },

      setShowcaseMode: (mode: 'grid' | 'detail') => {
        set((state) => ({
          ui: { ...state.ui, showcaseMode: mode },
        }))
      },

      setSelectedComponent: (componentId?: string) => {
        set((state) => ({
          ui: { ...state.ui, selectedComponent: componentId },
        }))
      },

      setSearchQuery: (query: string) => {
        set((state) => ({
          ui: { ...state.ui, searchQuery: query },
        }))
      },

      setFilterCategory: (category?: string) => {
        set((state) => ({
          ui: { ...state.ui, filterCategory: category },
        }))
      },

      // Preferences actions
      setAutoApplyChanges: (value: boolean) => {
        set((state) => ({
          preferences: { ...state.preferences, autoApplyChanges: value },
        }))
      },

      setShowCodeSnippets: (value: boolean) => {
        set((state) => ({
          preferences: { ...state.preferences, showCodeSnippets: value },
        }))
      },

      setViewportSize: (size: 'mobile' | 'tablet' | 'desktop') => {
        set((state) => ({
          preferences: { ...state.preferences, viewportSize: size },
        }))
      },

      // Persistence
      saveToLocalStorage: () => {
        // Handled automatically by persist middleware
      },

      loadFromLocalStorage: () => {
        // Handled automatically by persist middleware
      },
    }),
    {
      name: 'playground-storage',
      partialize: (state) => ({
        theme: state.theme,
        activeTokenSetId: state.activeTokenSetId,
        customTokenSet: state.customTokenSet,
        preferences: state.preferences,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme after store has been hydrated from localStorage (backup)
        if (state) {
          applyThemeToDocument(state.theme.mode)
        }
      },
    }
  )
)

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentMode = usePlaygroundStore.getState().theme.mode
    if (currentMode === ThemeMode.SYSTEM) {
      applyThemeToDocument(ThemeMode.SYSTEM)
    }
  })
}
