'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  /** Icon-only pill (header/nav contexts) vs a full labeled row (Profile/settings page). */
  variant?: 'icon' | 'row';
}

export function ThemeToggle({ className = '', variant = 'icon' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-3.5 py-3 bg-surface border border-line rounded-xl transition ${className}`}
      >
        <span className="flex items-center gap-2 text-[12px] font-bold text-heading">
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          Appearance
        </span>
        <span className="text-[11px] font-bold text-accent-blue">{isDark ? 'Dark' : 'Light'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-1.5 rounded-full transition ${className}`}
    >
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
