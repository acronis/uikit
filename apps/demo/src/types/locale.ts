export interface Language {
  code: string
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  enabled: boolean
}

export interface UserPreference {
  languageCode: string
  timestamp: number
  source: 'user-selected' | 'browser-detected' | 'default'
  storageKey: 'i18nextLng'
}

export type TranslationNamespace = 'common' | 'dashboard' | 'data' | 'settings'
