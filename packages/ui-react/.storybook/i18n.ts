/**
 * Demo-only message catalog for Storybook stories.
 *
 * ui-react components ship NO strings — every label/placeholder is passed in as
 * a prop. So the `locale` toolbar (see `preview.ts`) can only set `lang`/`dir` on
 * its own; it cannot translate a story's content. This catalog bridges that gap
 * for DEMO purposes: a story reads the active locale from the Storybook globals
 * and looks its sample text up here, so switching the toolbar shows the component
 * with real localized (and, for ar/he, RTL) content.
 *
 * This is NOT a runtime i18n system and ships nowhere — it exists purely to make
 * the locale toolbar meaningful in the preview. Add keys as stories need them.
 *
 * Usage in a story (globals arrive as the 2nd render arg):
 *
 *   import { t } from '../../../../.storybook/i18n';
 *   import type { Locale } from '../../../../.storybook/globals';
 *
 *   export const Localized: Story = {
 *     render: (args, { globals }) => (
 *       <Button {...args}>{t(globals.locale as Locale, 'submit')}</Button>
 *     ),
 *   };
 */
import type { Locale } from './globals';

export type MessageKey =
  | 'submit'
  | 'cancel'
  | 'search'
  | 'greeting'
  | 'notifications'
  | 'email';

export const MESSAGES: Record<Locale, Record<MessageKey, string>> = {
  en: {
    submit: 'Submit',
    cancel: 'Cancel',
    search: 'Search',
    greeting: 'Welcome',
    notifications: 'Enable notifications',
    email: 'Email address',
  },
  de: {
    submit: 'Absenden',
    cancel: 'Abbrechen',
    search: 'Suchen',
    greeting: 'Willkommen',
    notifications: 'Benachrichtigungen aktivieren',
    email: 'E-Mail-Adresse',
  },
  fr: {
    submit: 'Envoyer',
    cancel: 'Annuler',
    search: 'Rechercher',
    greeting: 'Bienvenue',
    notifications: 'Activer les notifications',
    email: 'Adresse e-mail',
  },
  ja: {
    submit: '送信',
    cancel: 'キャンセル',
    search: '検索',
    greeting: 'ようこそ',
    notifications: '通知を有効にする',
    email: 'メールアドレス',
  },
  ar: {
    submit: 'إرسال',
    cancel: 'إلغاء',
    search: 'بحث',
    greeting: 'مرحبًا',
    notifications: 'تفعيل الإشعارات',
    email: 'عنوان البريد الإلكتروني',
  },
  he: {
    submit: 'שליחה',
    cancel: 'ביטול',
    search: 'חיפוש',
    greeting: 'ברוך הבא',
    notifications: 'הפעלת התראות',
    email: 'כתובת אימייל',
  },
};

/** Look up a demo string for the active locale, falling back to English. */
export function t(locale: Locale, key: MessageKey): string {
  return (MESSAGES[locale] ?? MESSAGES.en)[key];
}
