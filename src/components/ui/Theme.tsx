import { useDarkMode } from '../../hooks/useDarkMode';

export function Theme() {
  const { theme, toggleTheme } = useDarkMode();
  return (
    <button onClick={toggleTheme} className='text-xl hover:scale-110 transition-transform' aria-label='Toggle Theme'>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
