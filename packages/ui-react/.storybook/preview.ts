// @ts-expect-error -- Storybook types use package.json "exports" which require moduleResolution "bundler"
import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

const preview: Preview = {
  globalTypes: {
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
    colorMode: 'light',
  },
  decorators: [
    (Story, context) => {
      const colorMode = (context.globals.colorMode as string) || 'light';
      const root = document.documentElement;
      root.classList.toggle('dark', colorMode === 'dark');
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
