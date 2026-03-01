import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0D1520',
          800: '#141E2B',
          700: '#1C2A38',
          600: '#1E3A3F',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #141E2B 0%, #1C2A38 50%, #1E3A3F 100%)',
        'card-gradient': 'linear-gradient(135deg, #1C2A38 0%, #1E3A3F 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
