import { resolve } from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/components/**/__stories__/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    const src = resolve(process.cwd(), 'src');
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@': src,
      // Render the shared demos (@acronis-platform/shadcn-uikit-demos)
      // against THIS library: the demos import from the legacy package, so
      // alias that specifier at ui-react's own source. Storybook is a Vite
      // build (no RSC), so aliasing client components here is safe — unlike
      // the Next docs app, which can't alias them. /react before the bare
      // specifier so the more specific match wins.
      '@acronis-platform/shadcn-uikit/react': resolve(src, 'react.ts'),
      '@acronis-platform/shadcn-uikit': resolve(src, 'index.ts'),
    };
    return viteConfig;
  },
};

export default config;
