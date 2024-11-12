// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Make sure Tailwind scans all your JSX/HTML files
  ],
  theme: {
    extend: {
      fontFamily: {
        'sour-gummy': ['Sour Gummy', 'sans-serif'],
      },
      colors: {
        sky: {
          100: '#e0f7fa',
          200: '#b2ebf2',
          300: '#80deea',
        },
      },
    },
  },
  plugins: [],
};
