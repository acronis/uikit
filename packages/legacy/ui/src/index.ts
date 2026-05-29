// Main entry point - exports both React and Vue components
export * from './react'
export * from './lib/utils'
export {
  applyTheme,
  getCurrentTheme,
  loadPersistedTheme,
  applyColorMode,
  getCurrentColorMode,
  loadPersistedColorMode,
  toggleColorMode,
  watchSystemColorScheme,
  initializeThemeSystem,
  type ThemeName,
  type ColorMode,
} from './utils'
export * from './types'
