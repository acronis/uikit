import preset from './tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/**/*.{js,jsx,ts,tsx,vue}',
    '../../../apps/demo/src/**/*.{js,jsx,ts,tsx,vue}', // Include demo app for dev mode
  ],
};
