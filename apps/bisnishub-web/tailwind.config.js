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
        hub: {
          bg: '#0B0F17',
          card: '#121824',
          cardHover: '#182132',
          border: '#1E293B',
          muted: '#64748B',
          text: '#F8FAFC',
        },
        teestock: {
          DEFAULT: '#D95D39',
          light: '#F8704A',
          dark: '#B84523',
        },
        multigraph: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
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
      }
    },
  },
  plugins: [],
}
