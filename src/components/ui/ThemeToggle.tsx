'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg" style={{ background: 'var(--bg-muted)' }} aria-hidden="true" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const label =
    theme === 'light' ? 'Switch to dark mode' :
    theme === 'dark' ? 'Switch to system theme' :
    'Switch to light mode';

  const Icon =
    theme === 'light' ? Sun :
    theme === 'dark' ? Moon :
    Monitor;

  return (
    <button
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer"
      style={{
        background: 'var(--bg-muted)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-brand)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-brand-400)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
      }}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );
}
