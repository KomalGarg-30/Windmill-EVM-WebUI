'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'segmented';
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className, variant = 'pill' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 text-neutral-400 opacity-60',
          className
        )}
        aria-hidden="true"
      >
        <Sun className="h-3.5 w-3.5" />
      </div>
    );
  }

  const themes = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Laptop },
  ] as const;

  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'flex items-center rounded-full p-0.5 border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900',
          className
        )}
        role="radiogroup"
        aria-label="Theme selection"
      >
        {themes.map(({ key, label, icon: Icon }) => {
          const isSelected = theme === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(key)}
              title={`${label} theme`}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'bg-white text-black shadow-xs dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Active icon based on current choice
  const CurrentIcon =
    theme === 'dark'
      ? Moon
      : theme === 'light'
      ? Sun
      : resolvedTheme === 'dark'
      ? Moon
      : Sun;

  return (
    <div ref={menuRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Theme: ${theme || 'system'}`}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100 hover:text-black transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
      >
        <CurrentIcon className="h-3.5 w-3.5 transition-transform duration-300 transform hover:rotate-12" />
        <span className="sr-only">Toggle theme (current: {theme})</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-36 origin-top-right rounded-2xl border border-neutral-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-dropdown-enter dark:border-neutral-800 dark:bg-neutral-900/95"
        >
          <div className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Appearance
          </div>
          {themes.map(({ key, label, icon: Icon }) => {
            const isSelected = theme === key;
            return (
              <button
                key={key}
                type="button"
                role="menuitem"
                onClick={() => {
                  setTheme(key);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-white'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </div>
                {isSelected && <Check className="h-3 w-3 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
