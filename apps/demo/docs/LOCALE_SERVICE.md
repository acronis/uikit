# Locale Service Documentation

## Overview

The locale service provides comprehensive internationalization (i18n) support for the demo application, enabling users to view and interact with the application in their preferred language.

## Features

- ✅ **5 Supported Languages**: English, Spanish, French, German, Japanese
- ✅ **Automatic Detection**: Browser language detection on first visit
- ✅ **Persistence**: Language preference saved across sessions via localStorage
- ✅ **Fallback Handling**: Automatic fallback to English for unsupported languages
- ✅ **Multiple Namespaces**: Organized translations (common, dashboard, data, settings)
- ✅ **Language Selector**: UI component for manual language switching
- ✅ **Performance**: <200ms language switching
- ✅ **Accessibility**: Full keyboard navigation and screen reader support

## Quick Start

### Using Translations in Components

```tsx
import { useLocale } from '../context/LocaleContext';

function MyComponent() {
  const { t, currentLanguage, changeLanguage } = useLocale();

  return (
    <div>
      <h1>{t('navigation.dashboard')}</h1>
      <button onClick={() => changeLanguage('es')}>Switch to Spanish</button>
    </div>
  );
}
```

### Using Specific Namespaces

```tsx
import { useTranslation } from 'react-i18next';

function DashboardPage() {
  const { t } = useTranslation('dashboard');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}
```

### Using Interpolation

```tsx
const { t } = useLocale();

// Translation: "Welcome, {{username}}!"
<p>{t('messages.welcome', { username: 'John' })}</p>;
// Output: "Welcome, John!"
```

## Translation File Structure

```
src/locales/
├── en/
│   ├── common.json      # Shared translations
│   ├── dashboard.json   # Dashboard-specific
│   ├── data.json        # Data table-specific
│   └── settings.json    # Settings-specific
├── es/
│   ├── common.json
│   ├── dashboard.json
│   ├── data.json
│   └── settings.json
└── [fr, de, ja]/        # Same structure
```

## Available Translation Keys

### Common Namespace

- `navigation.*` - Navigation items (dashboard, data, settings, logout, chat)
- `actions.*` - Action buttons (save, cancel, delete, edit, create, search, close, submit)
- `labels.*` - Form labels (language, theme, profile, email, password, username)
- `messages.*` - System messages (welcome, loading, error, success, noData, saved, deleted)

### Dashboard Namespace

- `title`, `subtitle` - Page headers
- `metrics.*` - Metric labels
- `charts.*` - Chart titles
- `activity.*` - Activity section

### Data Namespace

- `title`, `subtitle` - Page headers
- `table.*` - Table columns and actions
- `dialog.*` - Dialog titles and messages

### Settings Namespace

- `title`, `subtitle` - Page headers
- `tabs.*` - Tab labels
- `profile.*`, `preferences.*`, `account.*` - Section-specific translations

## Adding a New Language

1. Create translation files for the new language:

```bash
mkdir -p src/locales/pt
cp src/locales/en/*.json src/locales/pt/
```

2. Translate all keys in the new files

3. Add language to `SUPPORTED_LANGUAGES` in `src/app/services/localeService.ts`:

```typescript
export const SUPPORTED_LANGUAGES: Language[] = [
  // ... existing languages
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    enabled: true,
  },
];
```

4. Import and configure in `LocaleContext.tsx`:

```typescript
import ptCommon from '../../locales/pt/common.json';
// ... other namespaces

// Add to resources
pt: {
  common: ptCommon,
  dashboard: ptDashboard,
  data: ptData,
  settings: ptSettings,
}
```

## Testing

### Manual Testing

Use the test helper utilities in browser console:

```javascript
// Check current state
localeTestHelper.getState();

// Test browser detection
localeTestHelper.testBrowserDetection();

// Test persistence
localeTestHelper.testPersistence('es');

// Test fallback
localeTestHelper.testFallback();

// Clear preferences
localeTestHelper.clearPreferences();
```

### Automated Testing

Run the locale service tests:

```bash
pnpm test src/app/__tests__/locale/
```

## Performance

- **Language Switch**: <200ms (requirement: <200ms) ✅
- **Initial Load**: Minimal overhead with code splitting
- **Translation Lookup**: O(1) hash table lookup
- **Bundle Size**: ~10KB for i18next + react-i18next

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Troubleshooting

### Translations not showing

1. Check browser console for missing translation warnings
2. Verify translation keys exist in all language files
3. Ensure LocaleProvider wraps your app

### Language not persisting

1. Check localStorage is enabled in browser
2. Verify `i18nextLng` key exists in localStorage
3. Clear browser cache and test again

### Wrong language detected

1. Check browser language settings
2. Verify language code is in `SUPPORTED_LANGUAGES`
3. Clear localStorage and test fresh detection

## Architecture

```
┌─────────────────────────────────────┐
│         DemoApp (Root)              │
│  ┌───────────────────────────────┐  │
│  │      LocaleProvider           │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   i18next instance      │  │  │
│  │  │   - Detection           │  │  │
│  │  │   - Persistence         │  │  │
│  │  │   - Translation lookup  │  │  │
│  │  └─────────────────────────┘  │  │
│  │                                │  │
│  │  Components use:               │  │
│  │  - useLocale() hook            │  │
│  │  - useTranslation() hook       │  │
│  │  - LanguageSelector component  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Dependencies

- `i18next` ^23.16.8 - Core i18n framework
- `react-i18next` ^14.1.3 - React bindings
- `i18next-browser-languagedetector` ^7.2.2 - Browser detection

## Related Files

- `src/app/context/LocaleContext.tsx` - Main provider and hooks
- `src/app/services/localeService.ts` - Utility functions
- `src/app/components/LanguageSelector.tsx` - Language selector UI
- `src/app/utils/localeTestHelper.ts` - Testing utilities
- `src/types/locale.ts` - TypeScript definitions
- `src/locales/` - Translation files

## Support

For issues or questions about the locale service, refer to:

- [i18next documentation](https://www.i18next.com/)
- [react-i18next documentation](https://react.i18next.com/)
- Project quickstart guide: `specs/001-locale-service/quickstart.md`
