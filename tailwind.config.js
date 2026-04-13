/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Gold Palette
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4af37',
          600: '#b8941f',
          700: '#92710c',
          800: '#6b5310',
          900: '#453612',
        },
        // Silver Palette
        silver: {
          50: '#fafafa',
          100: '#f0f0f0',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#8a8a93',
          600: '#6b6b76',
          700: '#52525b',
          800: '#3f3f46',
          900: '#27272a',
        },
        // Dark Blacks
        obsidian: {
          DEFAULT: '#09090b',
          50: '#18181b',
          100: '#151517',
          200: '#111113',
          300: '#0d0d0f',
          400: '#09090b',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gold-shimmer': 'gold-shimmer 3s linear infinite',
        'float-up': 'float-up 1.2s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-up': 'slide-in-up 0.5s cubic-bezier(0.16,1,0.3,1)',
        'fade-in': 'fade-in 0.5s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16,1,0.3,1)',
        'progress-fill': 'progress-fill 1.2s cubic-bezier(0.16,1,0.3,1)',
        'shimmer': 'shimmer 2.5s linear infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        'spin-slow': 'spin 4s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'text-reveal': 'text-reveal 0.8s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212,175,55,0.15)' },
          '50%': { boxShadow: '0 0 25px rgba(212,175,55,0.3), 0 0 50px rgba(212,175,55,0.1)' },
        },
        'gold-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '40%': { opacity: '1', transform: 'translateY(-15px) scale(1.3)' },
          '100%': { opacity: '0', transform: 'translateY(-45px) scale(0.8)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(212,175,55,0.15)' },
          '50%': { borderColor: 'rgba(212,175,55,0.4)' },
        },
        'text-reveal': {
          '0%': { opacity: '0', transform: 'translateY(8px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #d4af37, #f5d76e, #d4af37)',
        'silver-gradient': 'linear-gradient(135deg, #8a8a93, #d4d4d8, #8a8a93)',
      },
    },
  },
  plugins: [],
}
