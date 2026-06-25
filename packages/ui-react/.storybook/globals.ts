/**
 * Storybook global state for the ui-react preview: brand, light/dark, text
 * direction, and locale. The apply* helpers mirror the canonical switching
 * model used by `apps/kitchen-sink/src/lib/tokens.ts`, since both consume the
 * same `@acronis-platform/tokens-pd` delivery model:
 *
 * - Light/dark is NOT a `.dark` class. The tokens use `light-dark()` resolved by
 *   `color-scheme`; ui-react's `dark:` variant keys off `[data-theme]`. So we set
 *   both `color-scheme` and `[data-theme]` on the root element.
 * - Brand is NOT a class toggle. `acronis` is the base layer (loaded by
 *   `src/styles/index.css`); `deep-sky` is an override-only `:root` stylesheet
 *   layered on top by injecting it into a managed `<style>` element.
 */

// deep-sky override-only `:root` stylesheets (semantic + every per-component tier
// that `src/styles/index.css` loads for acronis), imported as raw text and
// concatenated. Keep this list in sync with the component tiers imported there.
import semanticDeepSky from '@acronis-platform/tokens-pd/css/deep-sky.css?raw';
import avatarDeepSky from '@acronis-platform/tokens-pd/css/Avatar/deep-sky.css?raw';
import buttonDeepSky from '@acronis-platform/tokens-pd/css/Button/deep-sky.css?raw';
import buttonMenuDeepSky from '@acronis-platform/tokens-pd/css/ButtonMenu/deep-sky.css?raw';
import buttonIconDeepSky from '@acronis-platform/tokens-pd/css/ButtonIcon/deep-sky.css?raw';
import cardFilterDeepSky from '@acronis-platform/tokens-pd/css/CardFilter/deep-sky.css?raw';
import switchDeepSky from '@acronis-platform/tokens-pd/css/Switch/deep-sky.css?raw';
import checkboxDeepSky from '@acronis-platform/tokens-pd/css/Checkbox/deep-sky.css?raw';
import inputTextDeepSky from '@acronis-platform/tokens-pd/css/InputText/deep-sky.css?raw';
import inputTextAreaDeepSky from '@acronis-platform/tokens-pd/css/InputTextArea/deep-sky.css?raw';
import inputSearchDeepSky from '@acronis-platform/tokens-pd/css/InputSearch/deep-sky.css?raw';
import searchGlobalDeepSky from '@acronis-platform/tokens-pd/css/SearchGlobal/deep-sky.css?raw';
import radioDeepSky from '@acronis-platform/tokens-pd/css/Radio/deep-sky.css?raw';
import breadcrumbDeepSky from '@acronis-platform/tokens-pd/css/Breadcrumb/deep-sky.css?raw';
import resizableDeepSky from '@acronis-platform/tokens-pd/css/Resizable/deep-sky.css?raw';
import tagDeepSky from '@acronis-platform/tokens-pd/css/Tag/deep-sky.css?raw';
import tooltipDeepSky from '@acronis-platform/tokens-pd/css/Tooltip/deep-sky.css?raw';
import sidebarPrimaryDeepSky from '@acronis-platform/tokens-pd/css/SidebarPrimary/deep-sky.css?raw';
import sidebarSecondaryDeepSky from '@acronis-platform/tokens-pd/css/SidebarSecondary/deep-sky.css?raw';

export type Brand = 'acronis' | 'deep-sky';
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
  searchGlobalDeepSky,
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

/** Layer deep-sky's `:root` overrides on the acronis base, or clear them. */
export function applyBrand(brand: Brand): void {
  const existing = document.getElementById(BRAND_STYLE_ID);
  if (brand === 'acronis') {
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
