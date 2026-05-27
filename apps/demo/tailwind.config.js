import libraryConfig from '../../packages/legacy/ui/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    '../../packages/legacy/ui/src/**/*.{js,jsx,ts,tsx,vue}', // Include library components
  ],
  // Extend the library's config
  presets: [libraryConfig],
};
