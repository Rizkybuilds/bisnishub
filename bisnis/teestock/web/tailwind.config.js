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
        ts: {
          hitam: '#0E0D0C',
          surface: '#171615',
          surfaceHover: '#22201E',
          surfaceCard: 'rgba(23, 22, 21, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderDim: 'rgba(255, 255, 255, 0.04)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          krem: '#F5F2EB',
          kremLight: '#FAF8F5',
          kremMuted: '#C5BFB2',
          muted: '#8E8B82',
          // Series Accents
          terracotta: '#C1673D',
          terracottaGlow: 'rgba(193, 103, 61, 0.25)',
          mustard: '#D9A441',
          olive: '#6B7057',
          teal: '#4F7C74',
          rust: '#A84632',
          navy: '#33465C',
          berry: '#7E5265',
          indigo: '#435070',
          green: '#10B981',
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-terracotta': '0 0 35px -5px rgba(193, 103, 61, 0.3)',
        'glow-terracotta-sm': '0 0 15px -3px rgba(193, 103, 61, 0.4)',
        'glow-terracotta-lg': '0 0 50px -5px rgba(193, 103, 61, 0.4)',
        'glow-mustard': '0 0 35px -5px rgba(217, 164, 65, 0.25)',
        'glow-teal': '0 0 35px -5px rgba(79, 124, 116, 0.25)',
        'glow-teal-sm': '0 0 15px -3px rgba(79, 124, 116, 0.35)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.3)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        spotlight: {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%,-40%) scale(1)',
          },
        },
      }
    },
  },
  plugins: [],
};
