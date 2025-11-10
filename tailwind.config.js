/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Custom animations for the app
      keyframes: {
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-in',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
      // Custom colors matching your brand
      colors: {
        brand: {
          indigo: {
            50: '#eef2ff',
            600: '#4f46e5',
            700: '#4338ca',
          },
          purple: {
            600: '#9333ea',
            700: '#7e22ce',
          },
        },
      },
    },
  },
  plugins: [],
}
