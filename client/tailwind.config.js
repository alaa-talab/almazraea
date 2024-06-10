const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Cairo', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-rtl'),
    plugin(function({ addBase, config }) {
      addBase({
        'body': { direction: config('theme.direction', 'rtl') },
      });
    }),
  ],
};
