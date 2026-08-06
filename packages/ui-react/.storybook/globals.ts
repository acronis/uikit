/**
 * Storybook global state for the ui-react preview: brand, light/dark, text
 * direction, and locale. The apply* helpers implement the canonical switching
 * model for the `@acronis-platform/tokens-pd` delivery model:
 *
 * - Light/dark is NOT a `.dark` class. The tokens use `light-dark()` resolved by
 *   `color-scheme`; ui-react's `dark:` variant keys off `[data-theme]`. So we set
 *   both `color-scheme` and `[data-theme]` on the root element.
 * - Brand is NOT a class toggle. `default` is the base layer (loaded by
 *   `src/styles/index.css`); `deep_sky_itkontoret` is an override-only `:root`
 *   stylesheet layered on top by injecting it into a managed `<style>` element.
 */

// deep_sky_itkontoret override-only `:root` stylesheets (semantic + every
// per-component tier that `src/styles/index.css` loads for the default brand),
// imported as raw text and concatenated. Keep this list in sync with the
// component tiers imported there.
import semanticDeepSky from '@acronis-platform/tokens-pd/css/deep_sky_itkontoret.css?raw';
import avatarDeepSky from '@acronis-platform/tokens-pd/css/Avatar/deep_sky_itkontoret.css?raw';
import buttonDeepSky from '@acronis-platform/tokens-pd/css/Button/deep_sky_itkontoret.css?raw';
import buttonMenuDeepSky from '@acronis-platform/tokens-pd/css/ButtonMenu/deep_sky_itkontoret.css?raw';
import buttonIconDeepSky from '@acronis-platform/tokens-pd/css/ButtonIcon/deep_sky_itkontoret.css?raw';
import cardFilterDeepSky from '@acronis-platform/tokens-pd/css/CardFilter/deep_sky_itkontoret.css?raw';
import switchDeepSky from '@acronis-platform/tokens-pd/css/Switch/deep_sky_itkontoret.css?raw';
import checkboxDeepSky from '@acronis-platform/tokens-pd/css/Checkbox/deep_sky_itkontoret.css?raw';
import inputTextDeepSky from '@acronis-platform/tokens-pd/css/InputText/deep_sky_itkontoret.css?raw';
import inputTextAreaDeepSky from '@acronis-platform/tokens-pd/css/InputTextArea/deep_sky_itkontoret.css?raw';
import inputSearchDeepSky from '@acronis-platform/tokens-pd/css/InputSearch/deep_sky_itkontoret.css?raw';
import inputSelectDeepSky from '@acronis-platform/tokens-pd/css/InputSelect/deep_sky_itkontoret.css?raw';
import inputDatePickerDeepSky from '@acronis-platform/tokens-pd/css/InputDatePicker/deep_sky_itkontoret.css?raw';
import linkDeepSky from '@acronis-platform/tokens-pd/css/Link/deep_sky_itkontoret.css?raw';
import radioDeepSky from '@acronis-platform/tokens-pd/css/Radio/deep_sky_itkontoret.css?raw';
import breadcrumbDeepSky from '@acronis-platform/tokens-pd/css/Breadcrumb/deep_sky_itkontoret.css?raw';
import resizableDeepSky from '@acronis-platform/tokens-pd/css/Resizable/deep_sky_itkontoret.css?raw';
import tagDeepSky from '@acronis-platform/tokens-pd/css/Tag/deep_sky_itkontoret.css?raw';
import tooltipDeepSky from '@acronis-platform/tokens-pd/css/Tooltip/deep_sky_itkontoret.css?raw';
import sidebarPrimaryDeepSky from '@acronis-platform/tokens-pd/css/SidebarPrimary/deep_sky_itkontoret.css?raw';
import sidebarSecondaryDeepSky from '@acronis-platform/tokens-pd/css/SidebarSecondary/deep_sky_itkontoret.css?raw';

export type Brand = 'default' | 'deep_sky_itkontoret';
export type ColorMode = 'light' | 'dark';
export type Direction = 'auto' | 'ltr' | 'rtl';
export type Locale = 'en' | 'de' | 'fr' | 'ja' | 'ar' | 'he';

const DEEP_SKY_OVERRIDES = [
  semanticDeepSky,
  avatarDeepSky,
  buttonDeepSky,
  buttonMenuDeepSky,
  buttonIconDeepSky,
  cardFilterDeepSky,
  switchDeepSky,
  checkboxDeepSky,
  inputTextDeepSky,
  inputTextAreaDeepSky,
  inputSearchDeepSky,
  inputSelectDeepSky,
  inputDatePickerDeepSky,
  linkDeepSky,
  radioDeepSky,
  breadcrumbDeepSky,
  resizableDeepSky,
  tagDeepSky,
  tooltipDeepSky,
  sidebarPrimaryDeepSky,
  sidebarSecondaryDeepSky,
].join('\n');

// Locales that read right-to-left, used when `direction` is left on 'auto'.
const RTL_LOCALES = new Set<Locale>(['ar', 'he']);

const BRAND_STYLE_ID = 'sb-brand-override';

/** Layer deep_sky_itkontoret's `:root` overrides on the default base, or clear them. */
export function applyBrand(brand: Brand): void {
  const existing = document.getElementById(BRAND_STYLE_ID);
  if (brand === 'default') {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement('style');
  el.id = BRAND_STYLE_ID;
  el.textContent = DEEP_SKY_OVERRIDES;
  if (!existing) document.head.appendChild(el);
}

/** Flip light/dark: `color-scheme` drives `light-dark()`; `[data-theme]` drives `dark:`. */
export function applyColorMode(mode: ColorMode): void {
  const html = document.documentElement;
  html.dataset.theme = mode;
  html.style.colorScheme = mode;
}

/** Set `lang` + `dir`. With direction 'auto', RTL locales flip to rtl. */
export function applyLocaleAndDirection(
  locale: Locale,
  direction: Direction
): void {
  const html = document.documentElement;
  html.lang = locale;
  html.dir =
    direction === 'auto'
      ? RTL_LOCALES.has(locale)
        ? 'rtl'
        : 'ltr'
      : direction;
}
