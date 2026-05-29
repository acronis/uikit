/**
 * Locale Test Helper
 *
 * Manual testing utilities for locale service validation
 * Run these in browser console to test locale functionality
 */

export const localeTestHelper = {
  /**
   * Test browser language detection
   * Usage: localeTestHelper.testBrowserDetection()
   */
  testBrowserDetection() {
    const browserLang = navigator.language
    const detectedLang = browserLang.split('-')[0]
    const stored = localStorage.getItem('i18nextLng')

    console.log('Browser Language Detection Test:')
    console.log('- Browser language:', browserLang)
    console.log('- Detected language code:', detectedLang)
    console.log('- Stored preference:', stored)
    console.log('- Supported languages:', ['en', 'es', 'fr', 'de', 'ja'])

    return {
      browserLang,
      detectedLang,
      stored,
      isSupported: ['en', 'es', 'fr', 'de', 'ja'].includes(detectedLang),
    }
  },

  /**
   * Test fallback to English
   * Usage: localeTestHelper.testFallback()
   */
  testFallback() {
    const currentLang = localStorage.getItem('i18nextLng')
    console.log('Fallback Test:')
    console.log('- Current language:', currentLang)
    console.log('- Fallback language: en')
    console.log('- Test: Set unsupported language and verify fallback')

    // Simulate unsupported language
    localStorage.setItem('i18nextLng', 'xx')
    console.log('- Set language to "xx" (unsupported)')
    console.log('- Reload page to test fallback behavior')

    return { currentLang, testLang: 'xx' }
  },

  /**
   * Test language persistence
   * Usage: localeTestHelper.testPersistence('es')
   */
  testPersistence(langCode: string) {
    localStorage.setItem('i18nextLng', langCode)
    const stored = localStorage.getItem('i18nextLng')

    console.log('Persistence Test:')
    console.log('- Set language to:', langCode)
    console.log('- Retrieved from storage:', stored)
    console.log('- Match:', stored === langCode ? '✓ PASS' : '✗ FAIL')

    return { set: langCode, retrieved: stored, match: stored === langCode }
  },

  /**
   * Clear all locale preferences
   * Usage: localeTestHelper.clearPreferences()
   */
  clearPreferences() {
    localStorage.removeItem('i18nextLng')
    localStorage.removeItem('i18nextLng_timestamp')
    console.log('Locale preferences cleared')
    console.log('Reload page to test fresh detection')
  },

  /**
   * Get current locale state
   * Usage: localeTestHelper.getState()
   */
  getState() {
    const state = {
      currentLang: localStorage.getItem('i18nextLng'),
      timestamp: localStorage.getItem('i18nextLng_timestamp'),
      browserLang: navigator.language,
      supportedLangs: ['en', 'es', 'fr', 'de', 'ja'],
    }

    console.log('Current Locale State:', state)
    return state
  },
}

// Expose to window for browser console access
if (typeof window !== 'undefined') {
  ;(window as any).localeTestHelper = localeTestHelper
}
