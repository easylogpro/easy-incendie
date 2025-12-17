/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2F7',
          100: '#D9E2ED',
          200: '#B3C5DB',
          300: '#8DA8C9',
          400: '#678BB7',
          500: '#1E3A5F', // Couleur principale
          600: '#1A3254',
          700: '#162A49',
          800: '#12223E',
          900: '#0E1A33'
        },
        secondary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#2E7D32', // Vert
          600: '#27692A',
          700: '#205522',
          800: '#19411A',
          900: '#122D12'
        },
        accent: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#E65100', // Orange
          600: '#CC4700',
          700: '#B33D00',
          800: '#993300',
          900: '#802900'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
}
