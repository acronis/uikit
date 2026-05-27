import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';

const disableVitestAddon =
  process.env.STORYBOOK_DISABLE_ADDON_VITEST === 'true';

const config: StorybookConfig = {
  stories: [
    '../src/components/ui/**/__stories__/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/icons/__stories__/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/styles/__stories__/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    ...(!disableVitestAddon ? ['@storybook/addon-vitest'] : []),
    '@storybook/addon-a11y',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  async viteFinal(config) {
    // tw-animate-css only exports "." with a "style" condition, which Vite
    // doesn't recognize. The SCSS files use @import "tw-animate-css/dist/tw-animate.css"
    // (Sass passes .css imports through unchanged), but Vite rejects the subpath
    // because it's not in the package's exports map. Alias to the real file.
    const twAnimateCss = resolve(
      process.cwd(),
      'node_modules/tw-animate-css/dist/tw-animate.css'
    );
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'tw-animate-css/dist/tw-animate.css': twAnimateCss,
    };
    return config;
  },
};

export default config;
