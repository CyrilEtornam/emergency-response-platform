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
        surface: '#F8F9FA',
        border: '#E5E7EB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        dark: {
          bg: '#0F172A',
          surface: '#1E293B',
          'surface-hover': '#263147',
          border: '#334155',
          'text-primary': '#F1F5F9',
          'text-secondary': '#94A3B8',
        },
        agency: {
          medical: '#2563EB',
          police: '#D97706',
          fire: '#DC2626',
        },
        severity: {
          critical: '#DC2626',
          high: '#EA580C',
          medium: '#D97706',
          low: '#16A34A',
        },
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
