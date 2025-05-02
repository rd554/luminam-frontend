// tailwind.config.mjs
import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [lineClamp],
};

export default config;
