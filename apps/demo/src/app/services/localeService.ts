import { Language, UserPreference } from '../../types/locale'

const STORAGE_KEY = 'i18nextLng'
const STORAGE_TIMESTAMP_KEY = 'i18nextLng_timestamp'

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', enabled: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', enabled: true },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', enabled: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', enabled: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', enabled: true },
]

export function getStoredLanguage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredLanguage(languageCode: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, languageCode)
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, new Date().toISOString())
  } catch (error) {
    console.warn('Failed to store language preference:', error)
  }
}

export function clearStoredLanguage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY)
  } catch (error) {
    console.warn('Failed to clear language preference:', error)
  }
}

export function detectBrowserLanguage(supportedLanguages: string[]): string {
  const browserLang = navigator.language.split('-')[0]
  return supportedLanguages.includes(browserLang) ? browserLang : supportedLanguages[0]
}

export function isLanguageSupported(languageCode: string, supportedLanguages: string[]): boolean {
  return supportedLanguages.includes(languageCode)
}

export function getUserPreference(): UserPreference | null {
  const languageCode = getStoredLanguage()
  if (!languageCode) return null

  const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY)

  return {
    languageCode,
    timestamp: timestamp ? new Date(timestamp).getTime() : Date.now(),
    source: 'user-selected',
    storageKey: STORAGE_KEY,
  }
}

export function setUserPreference(languageCode: string, _source: UserPreference['source']): void {
  setStoredLanguage(languageCode)
}
