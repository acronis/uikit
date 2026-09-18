// @ts-expect-error -- Storybook types use package.json "exports" which require moduleResolution "bundler"
import type { Preview } from '@storybook/react';
import '../src/styles/index.css';
import {
  applyBrand,
  applyColorMode,
  applyLocaleAndDirection,
  type Brand,
  type ColorMode,
  type Direction,
  type Locale,
} from './globals';

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Token brand',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'deep_sky_itkontoret', title: 'Deep Sky (ITkontoret)' },
          { value: 'light-gray', title: 'Light Gray' },
          { value: 'telstra', title: 'Telstra' },
          { value: 'virtuozzo', title: 'Virtuozzo' },
          { value: 'yellow-1c', title: 'Yellow (1C)' },
          {
            value: 'blue_yellow_uss_signal',
            title: 'Blue & Yellow (USS Signal)',
          },
          { value: 'brown', title: 'Brown' },
          { value: 'dark_gray', title: 'Dark Gray' },
          { value: 'deep_purple', title: 'Deep Purple' },
          { value: 'green_also_choise_df', title: 'Green (ALSO/Choice DF)' },
          { value: 'ingram_micro', title: 'Ingram Micro' },
          { value: 'light_blue_hp', title: 'Light Blue (HP)' },
          {
            value: 'orange_tsukaeru_helpox',
            title: 'Orange (Tsukaeru/Helpox)',
          },
          { value: 'pinky', title: 'Pinky' },
          { value: 'purple', title: 'Purple' },
          { value: 'purple_fusion_media', title: 'Purple (Fusion Media)' },
          { value: 'red_fire_brick', title: 'Red (Fire Brick)' },
          { value: 'red_home_pl', title: 'Red (Home.pl)' },
          { value: 'sand', title: 'Sand' },
        ],
        dynamicTitle: true,
      },
    },
    colorMode: {
      description: 'Light or dark mode',
      toolbar: {
        title: 'Mode',
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Text direction',
      toolbar: {
        title: 'Direction',
        icon: 'mirror',
        items: [
          { value: 'auto', title: 'Auto (from locale)' },
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Document language',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'de', title: 'Deutsch' },
          { value: 'fr', title: 'Français' },
          { value: 'ja', title: '日本語' },
          { value: 'ar', title: 'العربية (RTL)' },
          { value: 'he', title: 'עברית (RTL)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: 'default',
    colorMode: 'light',
    direction: 'auto',
    locale: 'en',
  },
  decorators: [
    (Story, context) => {
      applyBrand((context.globals.brand as Brand) || 'default');
      applyColorMode((context.globals.colorMode as ColorMode) || 'light');
      applyLocaleAndDirection(
        (context.globals.locale as Locale) || 'en',
        (context.globals.direction as Direction) || 'auto'
      );
      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
