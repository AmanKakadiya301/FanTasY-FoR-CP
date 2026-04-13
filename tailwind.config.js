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
        neon: {
          purple: '#7C3AED',
          blue: '#3B82F6',
          pink: '#EC4899',
          cyan: '#22D3EE',
          orange: '#F97316',
          gold: '#FFD700',
          green: '#22C55E',
          yellow: '#FACC15',
          red: '#EF4444',
        },
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
        obsidian: {
          DEFAULT: '#05070f',
          50: '#1e2436',
          100: '#181d2c',
          200: '#131622',
          300: '#0b0f1a',
          400: '#090c18',
          500: '#05070f',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sub: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        premium: '.15em'
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'neon-shimmer': 'neon-shimmer 3s linear infinite',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16,1,0.3,1)',
        'progress-fill': 'progress-fill 1.2s cubic-bezier(0.16,1,0.3,1)',
        'spin-slow': 'spin 6s linear infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'text-reveal': 'text-reveal 0.8s cubic-bezier(0.16,1,0.3,1)',
        'float-slow': 'float-up 6s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'sweep': 'sweep 1.5s ease-in-out forwards',
        'flash': 'flash 0.5s ease-in-out',
      },
      keyframes: {
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'sweep': {
          '0%': { left: '-150%' },
          '100%': { left: '150%' },
        },
        'flash': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4', textShadow: '0 0 20px #fff' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(124,58,237,0.15)' },
          '50%': { boxShadow: '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(34,211,238,0.2)' },
        },
        'neon-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-up': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(124,58,237,0.2)' },
          '50%': { borderColor: 'rgba(34,211,238,0.5)' },
        },
        'text-reveal': {
          '0%': { opacity: '0', transform: 'translateY(8px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, #7C3AED, #3B82F6)',
        'hot-gradient': 'linear-gradient(135deg, #EC4899, #F97316)',
        'accent-gradient': 'linear-gradient(135deg, #22D3EE, #7C3AED)',
      },
    },
  },
  plugins: [],
}
