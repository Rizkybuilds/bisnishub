import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({ className = '', compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
      title={isDark ? 'Mode Terang (Light Mode)' : 'Mode Gelap (Dark Mode)'}
      className={`relative inline-flex items-center justify-center transition-all duration-200 border rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ts-terracotta ${
        compact 
          ? 'w-8 h-8 text-xs' 
          : 'w-9 h-9 text-sm'
      } bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border-ts-border hover:border-ts-borderHover ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-300 absolute ${
            isDark
              ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`w-4 h-4 text-ts-terracotta transition-all duration-300 absolute ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
          }`}
        />
      </div>
    </button>
  );
}
