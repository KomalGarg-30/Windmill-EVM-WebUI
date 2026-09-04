'use client';

import { startTransition, useEffect, useState } from 'react';

const THEMES = [
  { id: 'matrix', label: 'Matrix Cyber Green', color: '#228b22' },
  { id: 'gold', label: 'Celestial Gold', color: '#ffc517' },
  { id: 'purple', label: 'Purple Cyberpunk', color: '#a855f7' },
  { id: 'cyan', label: 'Electric Cyan', color: '#00f0ff' },
  { id: 'crimson', label: 'Solarium Crimson', color: '#ff0055' },
] as const;

type ThemeId = (typeof THEMES)[number]['id'];

function setDocumentTheme(theme: ThemeId) {
  const selected = THEMES.find((item) => item.id === theme) ?? THEMES[0];
  document.documentElement.style.setProperty('--accent', selected.color);
  document.documentElement.style.setProperty('--accent-glow', `${selected.color}4d`);
  document.documentElement.style.setProperty('--accent-soft', `${selected.color}4d`);
  document.documentElement.style.setProperty('--accent-faint', `${selected.color}1f`);
  document.documentElement.style.setProperty('--accent-spotlight', `${selected.color}1f`);
  document.documentElement.dataset.windmillTheme = theme;
}

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('matrix');

  function applyTheme(theme: ThemeId) {
    setDocumentTheme(theme);
    window.localStorage.setItem('windmill-theme', theme);
    setActiveTheme(theme);
  }

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('windmill-theme') as ThemeId | null;
    const theme: ThemeId = savedTheme && THEMES.some((item) => item.id === savedTheme) ? savedTheme : 'matrix';
    setDocumentTheme(theme);

    if (theme !== 'matrix') {
      startTransition(() => setActiveTheme(theme));
    }
  }, []);

  return (
    <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 border border-white/10 bg-panel/85 px-2.5 py-2 backdrop-blur-md" aria-label="Accent color theme">
      <span className="mr-1 hidden font-mono text-[9px] uppercase tracking-widest text-muted-foreground sm:inline">Accent</span>
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          aria-label={theme.label}
          title={theme.label}
          aria-pressed={activeTheme === theme.id}
          onClick={() => applyTheme(theme.id)}
          className={`h-4 w-4 rounded-full border transition-transform hover:scale-125 ${activeTheme === theme.id ? 'border-white ring-2 ring-white/30' : 'border-white/30'}`}
          style={{ backgroundColor: theme.color }}
        />
      ))}
    </div>
  );
}
