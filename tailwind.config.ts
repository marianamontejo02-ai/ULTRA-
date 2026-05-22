import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ultra: {
          50:  '#FFF5F0',
          100: '#FFE8DA',
          200: '#FFD0B5',
          300: '#FFB085',
          400: '#FF8C52',
          500: '#FF6B35',
          600: '#E85A25',
          700: '#C44A1E',
          800: '#9B3A17',
          900: '#7A2D10',
          950: '#3D1608',
        },
        nude: {
          50:  '#FDF8F5',
          100: '#F9EDE3',
          200: '#F2D9C3',
          300: '#E8C09E',
          400: '#DCA678',
          500: '#CC8B55',
          600: '#B87340',
          700: '#9A5E32',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'fade-in': 'fadeIn 0.4s ease-out',
        'ticker': 'ticker 30s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'ultra-gradient': 'linear-gradient(135deg, #FF6B35 0%, #E85A25 50%, #FF8C52 100%)',
        'ultra-gradient-soft': 'linear-gradient(135deg, #FFF5F0 0%, #FFE8DA 100%)',
        'hero-overlay': 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};

export default config;
