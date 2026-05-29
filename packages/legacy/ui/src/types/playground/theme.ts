/**
 * Theme mode enumeration
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

/**
 * Theme configuration
 */
export interface Theme {
  mode: ThemeMode
}
