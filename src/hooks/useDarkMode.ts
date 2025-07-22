import { useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/Storage';

export type Theme = 'light' | 'dark';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const saved = loadFromStorage<Theme>('theme', prefersDark);
    return saved;
  });

  useEffect(() => {
    saveToStorage<Theme>('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}
