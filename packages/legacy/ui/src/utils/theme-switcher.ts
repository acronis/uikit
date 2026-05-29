/**
 * Theme Switcher Utility
 * 
 * Provides functions to programmatically switch between themes and color modes.
 * Supports both theme switching (e.g., acronis-default, acronis-ocean) and
 * color mode switching (light/dark).
 */

export type ThemeName =
  | 'acronis-default' | 'acronis-ocean' | 'cyber-chat' | 'custom'
  | 'purple' | 'brown' | 'sand' | 'light-gray' | 'dark-gray'
  | 'ingram-micro' | 'red-fire-brick' | 'yellow-1c' | 'deep-sky-itkontoret'
  | 'blue-yellow-uss-signal' | 'red-home-pl' | 'orange-tsukaeru-helpox'
  | 'green-also-choise-df' | 'light-blue-hp' | 'purple-fusion-media'
  | 'virtual-one' | 'telstra' | 'deep-purple' | 'pinky' | 'virtuozzo'
export type ColorMode = 'light' | 'dark' | 'system'

const THEME_CLASS_PREFIX = 'theme-'
const DARK_CLASS = 'dark'
const THEME_STORAGE_KEY = 'av-theme'
const COLOR_MODE_STORAGE_KEY = 'av-color-mode'

/**
 * Apply a theme to the document root element and any additional roots.
 * 
 * @param theme - The theme name to apply
 * @param persist - Whether to persist the theme choice to localStorage (default: true)
 * @param extraRoots - Additional elements to apply the theme to (e.g. shadow DOM inner containers)
 * 
 * @example
 * ```typescript
 * import { applyTheme } from '@acronis-platform/shadcn-uikit/utils/theme-switcher'
 * 
 * applyTheme('acronis-ocean')
 * 
 * // Shadow DOM usage:
 * applyTheme('acronis-ocean', true, [shadowContainer])
 * ```
 */
export function applyTheme(theme: ThemeName, persist = true, extraRoots: HTMLElement[] = []): void {
  const allRoots = [document.documentElement, ...extraRoots]

  allRoots.forEach((root) => {
    root.classList.forEach((className) => {
      if (className.startsWith(THEME_CLASS_PREFIX)) {
        root.classList.remove(className)
      }
    })

    root.classList.add(`${THEME_CLASS_PREFIX}${theme}`)
  })

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Failed to persist theme to localStorage:', error)
    }
  }
}

/**
 * Get the currently applied theme
 *
 * @returns The current theme name or null if no theme is explicitly set
 */
export function getCurrentTheme(): ThemeName | null {
  const root = document.documentElement
  
  for (const className of root.classList) {
    if (className.startsWith(THEME_CLASS_PREFIX)) {
      return className.replace(THEME_CLASS_PREFIX, '') as ThemeName
    }
  }
  
  return null
}

/**
 * Load the persisted theme from localStorage and apply it
 * Call this on application startup to restore the user's theme preference
 * 
 * @returns The loaded theme name or null if no theme was persisted
 */
export function loadPersistedTheme(): ThemeName | null {
  try {
    const persistedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null
    if (persistedTheme) {
      applyTheme(persistedTheme, false)
      return persistedTheme
    }
  } catch (error) {
    console.warn('Failed to load persisted theme from localStorage:', error)
  }
  
  return null
}

/**
 * Apply a color mode (light/dark/system) to the document root element
 * 
 * @param mode - The color mode to apply
 * @param persist - Whether to persist the mode choice to localStorage (default: true)
 * 
 * @example
 * ```typescript
 * import { applyColorMode } from '@acronis/shadcn-uikit/utils/theme-switcher'
 * 
 * applyColorMode('dark')
 * applyColorMode('system') // Follows system preference
 * ```
 */
export function applyColorMode(mode: ColorMode, persist = true): void {
  const root = document.documentElement
  
  if (mode === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle(DARK_CLASS, systemPrefersDark)
  } else {
    root.classList.toggle(DARK_CLASS, mode === 'dark')
  }
  
  if (persist) {
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)
    } catch (error) {
      console.warn('Failed to persist color mode to localStorage:', error)
    }
  }
}

/**
 * Get the currently applied color mode
 * 
 * @returns 'light' or 'dark' based on the current state
 */
export function getCurrentColorMode(): 'light' | 'dark' {
  return document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light'
}

/**
 * Load the persisted color mode from localStorage and apply it
 * Call this on application startup to restore the user's color mode preference
 * 
 * @returns The loaded color mode or null if no mode was persisted
 */
export function loadPersistedColorMode(): ColorMode | null {
  try {
    const persistedMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY) as ColorMode | null
    if (persistedMode) {
      applyColorMode(persistedMode, false)
      return persistedMode
    }
  } catch (error) {
    console.warn('Failed to load persisted color mode from localStorage:', error)
  }
  
  return null
}

/**
 * Toggle between light and dark mode
 * 
 * @param persist - Whether to persist the mode choice to localStorage (default: true)
 * @returns The new color mode after toggling
 */
export function toggleColorMode(persist = true): 'light' | 'dark' {
  const currentMode = getCurrentColorMode()
  const newMode = currentMode === 'light' ? 'dark' : 'light'
  applyColorMode(newMode, persist)
  return newMode
}

/**
 * Set up a listener for system color scheme changes
 * Only applies changes if the current mode is set to 'system'
 * 
 * @returns A cleanup function to remove the listener
 */
export function watchSystemColorScheme(): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handler = (e: MediaQueryListEvent) => {
    try {
      const persistedMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
      if (persistedMode === 'system') {
        document.documentElement.classList.toggle(DARK_CLASS, e.matches)
      }
    } catch (error) {
      console.warn('Failed to check persisted color mode:', error)
    }
  }
  
  mediaQuery.addEventListener('change', handler)
  
  return () => {
    mediaQuery.removeEventListener('change', handler)
  }
}

/**
 * Initialize the theme system on application startup
 * Loads persisted theme and color mode preferences
 * Sets up system color scheme watcher if mode is 'system'
 * 
 * @returns A cleanup function to remove event listeners
 * 
 * @example
 * ```typescript
 * import { initializeThemeSystem } from '@acronis/shadcn-uikit/utils/theme-switcher'
 * 
 * // In your app initialization
 * const cleanup = initializeThemeSystem()
 * 
 * // Call cleanup when unmounting (e.g., in React useEffect)
 * return cleanup
 * ```
 */
export function initializeThemeSystem(): () => void {
  loadPersistedTheme()
  loadPersistedColorMode()
  
  const cleanup = watchSystemColorScheme()
  
  return cleanup
}
