import * as React from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Language } from '../../types/locale';
import { SUPPORTED_LANGUAGES, setUserPreference } from '../services/localeService';

import enCommon from '../../locales/en/common.json';
import esCommon from '../../locales/es/common.json';
import frCommon from '../../locales/fr/common.json';
import deCommon from '../../locales/de/common.json';
import jaCommon from '../../locales/ja/common.json';

import enDashboard from '../../locales/en/dashboard.json';
import esDashboard from '../../locales/es/dashboard.json';
import frDashboard from '../../locales/fr/dashboard.json';
import deDashboard from '../../locales/de/dashboard.json';
import jaDashboard from '../../locales/ja/dashboard.json';

import enData from '../../locales/en/data.json';
import esData from '../../locales/es/data.json';
import frData from '../../locales/fr/data.json';
import deData from '../../locales/de/data.json';
import jaData from '../../locales/ja/data.json';

import enSettings from '../../locales/en/settings.json';
import esSettings from '../../locales/es/settings.json';
import frSettings from '../../locales/fr/settings.json';
import deSettings from '../../locales/de/settings.json';
import jaSettings from '../../locales/ja/settings.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        common: enCommon,
        dashboard: enDashboard,
        data: enData,
        settings: enSettings,
      },
      es: { 
        common: esCommon,
        dashboard: esDashboard,
        data: esData,
        settings: esSettings,
      },
      fr: { 
        common: frCommon,
        dashboard: frDashboard,
        data: frData,
        settings: frSettings,
      },
      de: { 
        common: deCommon,
        dashboard: deDashboard,
        data: deData,
        settings: deSettings,
      },
      ja: { 
        common: jaCommon,
        dashboard: jaDashboard,
        data: jaData,
        settings: jaSettings,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    supportedLngs: SUPPORTED_LANGUAGES.map(lang => lang.code),
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: [${lngs}] ${ns}:${key}`);
      }
    },
  });

interface LocaleContextValue {
  currentLanguage: string;
  availableLanguages: Language[];
  isLoading: boolean;
  error: Error | null;
  changeLanguage: (code: string) => Promise<void>;
  t: (key: string, params?: Record<string, any>) => string;
  getLanguageByCode: (code: string) => Language | undefined;
  isLanguageSupported: (code: string) => boolean;
}

const LocaleContext = React.createContext<LocaleContextValue | undefined>(undefined);

/**
 * LocaleProvider - Provides internationalization (i18n) context to the application
 * 
 * Features:
 * - Automatic browser language detection on first visit
 * - 5 supported languages: English, Spanish, French, German, Japanese
 * - localStorage persistence across sessions
 * - Fallback to English for unsupported languages or missing translations
 * - Multiple translation namespaces: common, dashboard, data, settings
 * - Loading and error states with UI feedback
 * 
 * Usage:
 * ```tsx
 * // Wrap your app with LocaleProvider
 * <LocaleProvider>
 *   <App />
 * </LocaleProvider>
 * 
 * // Use the useLocale hook in components
 * function MyComponent() {
 *   const { t, currentLanguage, changeLanguage } = useLocale();
 *   return <div>{t('navigation.dashboard')}</div>;
 * }
 * 
 * // Use specific namespaces
 * const { t } = useTranslation('dashboard');
 * return <h1>{t('title')}</h1>;
 * ```
 * 
 * @see useLocale - Hook to access locale context
 * @see LanguageSelector - Component for language switching UI
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n: i18nInstance, ready } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // All hooks must be called before any conditional returns
  const changeLanguage = React.useCallback(async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await i18nInstance.changeLanguage(code);
      setUserPreference(code, 'user-selected');
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [i18nInstance]);

  const getLanguageByCode = React.useCallback((code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }, []);

  const isLanguageSupported = React.useCallback((code: string) => {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
  }, []);

  // Show loading state while i18next initializes
  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading translations...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load translations</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const value: LocaleContextValue = {
    currentLanguage: i18nInstance.language,
    availableLanguages: SUPPORTED_LANGUAGES,
    isLoading,
    error,
    changeLanguage,
    t,
    getLanguageByCode,
    isLanguageSupported,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = React.useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
