// @ts-expect-error -- Storybook types use package.json "exports" which require moduleResolution "bundler"
import type { Preview } from '@storybook/react'
import '../src/styles/index.scss'
import '../src/styles/themes/acronis-ocean.scss'
import '../src/styles/themes/cyber-chat.scss'
import '../src/styles/themes/acronis-white-label.scss'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'acronis-default', title: 'Acronis' },
          // white label
          { value: 'blue-yellow', title: 'Blue Yellow' },
          { value: 'brown', title: 'Brown' },
          { value: 'dark-gray', title: 'Dark Gray' },
          { value: 'deep-purple', title: 'Deep Purple' },
          { value: 'deep-sky', title: 'Deep sky' },
          { value: 'green', title: 'Green' },
          { value: 'light-blue', title: 'Light Blue' },
          { value: 'light-gray', title: 'Light Gray' },
          { value: 'orange', title: 'Orange' },
          { value: 'pinky', title: 'Pinky' },
          { value: 'purple', title: 'Purple' },
          { value: 'purple-fusion', title: 'Purple Fusion' },
          { value: 'red', title: 'Red' },
          { value: 'sand', title: 'Sand' },
          { value: 'telstra', title: 'Light Blue' },
          { value: 'virtual-one', title: 'Virtual One' },
          { value: 'virtuozzo', title: 'Virtuozzo' },
          { value: 'yellow', title: 'Yellow' },
          // demo
          { value: 'shadcn-default', title: 'Default' },
          { value: 'cyber-chat', title: 'Cyber Chat' },
          { value: 'electric', title: 'Electric' },
          { value: 'forest', title: 'Forest' },
          { value: 'lavender', title: 'Lavender' },
          { value: 'monochrome', title: 'Monochrome' },
          { value: 'ocean', title: 'Ocean' },
          { value: 'sunset', title: 'Sunset' },
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
  },
  initialGlobals: {
    theme: 'acronis-default',
    colorMode: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) || 'acronis-default';
      const colorMode = (context.globals.colorMode as string) || 'light';

      const root = document.documentElement;
      root.className = root.className
        .replace(/\btheme-\S+/g, '')
        .replace(/\bdark\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      root.classList.add(`theme-${theme}`);
      if (colorMode === 'dark') {
        root.classList.add('dark');
      }

      return Story();
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview
