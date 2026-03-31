/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fef3ee',
          100: '#fde4d3',
          200: '#fac5a5',
          300: '#f69d6d',
          400: '#f07033',
          500: '#eb5213',
          600: '#dc3a09',
          700: '#b62a0a',
          800: '#912310',
          900: '#751f10',
        },
        accent: {
          400: '#facc15',
          500: '#eab308',
        },
        dark: '#0f0f0f',
        surface: '#1a1a1a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.14)',
        'brand': '0 4px 24px rgba(235,82,19,0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
