/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        base:      '#21211e',
        surface:   '#2a2a27',
        elevated:  '#333330',
        input:     '#1e1e1b',
        subtle:    '#3a3a36',
        default:   '#4a4a45',
        strong:    '#5a5a54',
        primary:   '#f0ede6',
        secondary: '#a09d96',
        muted:     '#6b6860',
        accent: {
          DEFAULT: '#e8622a',
          hover:   '#d4541f',
        },
        success: '#4caf6e',
        warning: '#e8a82a',
        danger:  '#e84242',
        info:    '#4a9ee8',
        medical: '#4a9ee8',
        police:  '#e8a82a',
        fire:    '#e84242',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
