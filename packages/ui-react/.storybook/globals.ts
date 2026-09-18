/**
 * Storybook global state for the ui-react preview: brand, light/dark, text
 * direction, and locale. The apply* helpers implement the canonical switching
 * model for the `@acronis-platform/tokens-pd` delivery model:
 *
 * - Light/dark is NOT a `.dark` class. The tokens use `light-dark()` resolved by
 *   `color-scheme`; ui-react's `dark:` variant keys off `[data-theme]`. So we set
 *   both `color-scheme` and `[data-theme]` on the root element.
 * - Brand is NOT a class toggle, and it is NOT a per-tier override list either
 *   (that used to mean hand-listing every component tier here and keeping it in
 *   sync with `src/styles/index.css` — exactly the drift `tokens-pd`'s
 *   `bundles/<brand>.css` exists to prevent). `default` is the base layer
 *   (loaded by `src/styles/index.css`); every other brand is swapped in wholesale
 *   by injecting its full bundle — semantics + every component tier in one
 *   file — into a managed `<style>` element. This is the same runtime
 *   brand-switching pattern documented in `apps/docs/content/docs/theming.mdx`.
 */

import bundleDeepSky from '@acronis-platform/tokens-pd/bundles/deep_sky_itkontoret.css?raw';
import bundleLightGray from '@acronis-platform/tokens-pd/bundles/light-gray.css?raw';
import bundleTelstra from '@acronis-platform/tokens-pd/bundles/telstra.css?raw';
import bundleVirtuozzo from '@acronis-platform/tokens-pd/bundles/virtuozzo.css?raw';
import bundleYellow1c from '@acronis-platform/tokens-pd/bundles/yellow-1c.css?raw';
import bundleBlueYellowUssSignal from '@acronis-platform/tokens-pd/bundles/blue_yellow_uss_signal.css?raw';
import bundleBrown from '@acronis-platform/tokens-pd/bundles/brown.css?raw';
import bundleDarkGray from '@acronis-platform/tokens-pd/bundles/dark_gray.css?raw';
import bundleDeepPurple from '@acronis-platform/tokens-pd/bundles/deep_purple.css?raw';
import bundleGreenAlsoChoiseDf from '@acronis-platform/tokens-pd/bundles/green_also_choise_df.css?raw';
import bundleIngramMicro from '@acronis-platform/tokens-pd/bundles/ingram_micro.css?raw';
import bundleLightBlueHp from '@acronis-platform/tokens-pd/bundles/light_blue_hp.css?raw';
import bundleOrangeTsukaeruHelpox from '@acronis-platform/tokens-pd/bundles/orange_tsukaeru_helpox.css?raw';
import bundlePinky from '@acronis-platform/tokens-pd/bundles/pinky.css?raw';
import bundlePurple from '@acronis-platform/tokens-pd/bundles/purple.css?raw';
import bundlePurpleFusionMedia from '@acronis-platform/tokens-pd/bundles/purple_fusion_media.css?raw';
import bundleRedFireBrick from '@acronis-platform/tokens-pd/bundles/red_fire_brick.css?raw';
import bundleRedHomePl from '@acronis-platform/tokens-pd/bundles/red_home_pl.css?raw';
import bundleSand from '@acronis-platform/tokens-pd/bundles/sand.css?raw';

export type Brand =
  | 'default'
  | 'deep_sky_itkontoret'
  | 'light-gray'
  | 'telstra'
  | 'virtuozzo'
  | 'yellow-1c'
  | 'blue_yellow_uss_signal'
  | 'brown'
  | 'dark_gray'
  | 'deep_purple'
  | 'green_also_choise_df'
  | 'ingram_micro'
  | 'light_blue_hp'
  | 'orange_tsukaeru_helpox'
  | 'pinky'
  | 'purple'
  | 'purple_fusion_media'
  | 'red_fire_brick'
  | 'red_home_pl'
  | 'sand';
export type ColorMode = 'light' | 'dark';
export type Direction = 'auto' | 'ltr' | 'rtl';
export type Locale = 'en' | 'de' | 'fr' | 'ja' | 'ar' | 'he';

/** Every non-default brand's full bundle, keyed for `applyBrand`. */
const BRAND_BUNDLES: Record<Exclude<Brand, 'default'>, string> = {
  deep_sky_itkontoret: bundleDeepSky,
  'light-gray': bundleLightGray,
  telstra: bundleTelstra,
  virtuozzo: bundleVirtuozzo,
  'yellow-1c': bundleYellow1c,
  blue_yellow_uss_signal: bundleBlueYellowUssSignal,
  brown: bundleBrown,
  dark_gray: bundleDarkGray,
  deep_purple: bundleDeepPurple,
  green_also_choise_df: bundleGreenAlsoChoiseDf,
  ingram_micro: bundleIngramMicro,
  light_blue_hp: bundleLightBlueHp,
  orange_tsukaeru_helpox: bundleOrangeTsukaeruHelpox,
  pinky: bundlePinky,
  purple: bundlePurple,
  purple_fusion_media: bundlePurpleFusionMedia,
  red_fire_brick: bundleRedFireBrick,
  red_home_pl: bundleRedHomePl,
  sand: bundleSand,
};

const BRAND_STYLE_ID = 'sb-brand-override';

/**
 * Swap in a brand's full bundle (semantics + every component tier), or clear
 * the override to fall back to the default brand `src/styles/index.css`
 * already loads. A bundle is full-strength, not an override-only diff, so it
 * replaces rather than layers — one `<style>` element holds at most one brand.
 */
export function applyBrand(brand: Brand): void {
  const existing = document.getElementById(BRAND_STYLE_ID);
  if (brand === 'default') {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement('style');
  el.id = BRAND_STYLE_ID;
  el.textContent = BRAND_BUNDLES[brand];
  if (!existing) document.head.appendChild(el);
}

/** Flip light/dark: `color-scheme` drives `light-dark()`; `[data-theme]` drives `dark:`. */
export function applyColorMode(mode: ColorMode): void {
  const html = document.documentElement;
  html.dataset.theme = mode;
  html.style.colorScheme = mode;
}

// Locales that read right-to-left, used when `direction` is left on 'auto'.
const RTL_LOCALES = new Set<Locale>(['ar', 'he']);

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
