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
          hitam: '#141413',
          surface: '#1C1B1A',
          surfaceHover: '#262422',
          border: '#2E2C29',
          borderDim: '#252422',
          krem: '#F2EEE4',
          kremLight: '#FAF8F5',
          kremMuted: '#D6D0C4',
          muted: '#828076',
          // Series Accents
          terracotta: '#C1673D',
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
    },
  },
  plugins: [],
};
