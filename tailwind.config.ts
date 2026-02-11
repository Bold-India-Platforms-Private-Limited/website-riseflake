import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        'primary-light': '#818cf8',
        secondary: '#ec4899',
        'accent-blue': '#3b82f6',
        'accent-purple': '#a855f7',
        'light-bg': '#ffffff',
        'light-surface': '#f8fafc',
        'light-secondary': '#f1f5f9',
      },
      backgroundImage: {
        'gradient-modern': 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #ec4899 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'scroll-ltr': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-out-left': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-120%)', opacity: '0' },
        },
      },
      animation: {
        'scroll-ltr-desktop-smooth': 'scroll-ltr 55s linear infinite',
        'scroll-ltr-slow': 'scroll-ltr 80s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-out-left': 'slide-out-left 0.6s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
