import preset from './tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  // Scan reference file that contains many utility classes to force generation
  content: ['./src/styles/tailwind-reference.html'],
};
