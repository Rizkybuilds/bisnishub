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
          hitam: 'var(--color-bg-base)',
          surface: 'var(--color-bg-surface)',
          surfaceHover: 'var(--color-bg-surface-hover)',
          surfaceCard: 'var(--color-bg-surface-card)',
          border: 'var(--color-border)',
          borderDim: 'var(--color-border-dim)',
          borderHover: 'var(--color-border-hover)',
          krem: 'var(--color-text-krem)',
          kremLight: 'var(--color-text-krem-light)',
          kremMuted: 'var(--color-text-krem-muted)',
          muted: 'var(--color-text-muted)',
          // Series Accents
          terracotta: 'var(--color-terracotta)',
          terracottaGlow: 'var(--color-terracotta-glow)',
          mustard: 'var(--color-mustard)',
          olive: '#6B7057',
          teal: 'var(--color-teal)',
          rust: '#A84632',
          navy: '#33465C',
          berry: '#7E5265',
          indigo: '#435070',
          green: '#10B981',
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-terracotta': '0 0 25px -5px rgba(217, 93, 57, 0.18)',
        'glow-terracotta-sm': '0 0 12px -3px rgba(217, 93, 57, 0.22)',
        'glow-white': '0 0 30px -5px rgba(255, 255, 255, 0.15)',
        'card-luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up-delay-1': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'fade-in-up-delay-3': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'text-reveal': 'textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-up': 'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        textReveal: {
          '0%': { opacity: '0', transform: 'translateY(100%)', clipPath: 'inset(0 0 100% 0)' },
          '100%': { opacity: '1', transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
};
