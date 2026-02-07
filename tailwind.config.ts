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
    },
  },
  plugins: [],
}
export default config
