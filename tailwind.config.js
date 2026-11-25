/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  corePlugins: { preflight: true },
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Standard Tailwind modern palettes for clean documentation UI
      slate: colors.slate,
      zinc: colors.zinc,
      emerald: colors.emerald,
      sky: colors.sky,
      // TODO: Get feedback from Mo on using this aqua color tag
      aqua: '#f2f9f9',
      black: '#000000',
      blue: {
        50: '#EDFDFF',
        100: '#BEDDF9',
        300: '#83F1FF',
        500: '#1ECCFF',
        700: '#009FFF',
        900: '#0D569B',
      },
      /* podman desktop purple */
      'deep-purple': {
        50: '#F5F4FA',
        100: '#E1C5FF',
        300: '#B39ADD',
        500: '#8870B0',
        700: '#5F4986',
        900: '#37255D',
      },
      gray: {
        50: '#F7F6F9',
        100: '#D3CDDF',
        300: '#A5A0B1',
        500: '#7A7485',
        700: '#514C5C',
        // 900: '#2B2735',
        900: '#1B1B1D',
      },
      /* podman purple */
      purple: {
        50: '#FBF5F3',
        100: '#F7EAFD',
        300: '#E3B4F3',
        500: '#BD58DD',
        /*Brand Purple */
        700: '#892CA0',
        900: '#5F246B',
      },
      white: '#FFFFFF',
    },
    fontFamily: {
      display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      text: ['"Source Sans Pro"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['"Source Code Pro"', 'ui-monospace', 'monospace'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'water-texture': "url('/images/optimized/water-background-1370w-605h.webp')",
      },
      spacing: {
        '98': '26rem',
        '100': '30rem',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
