import { useDarkMode } from '../../hooks/useDarkMode';

export function Theme() {
  const { theme, toggleTheme } = useDarkMode();
  return (
    <div className='flex justify-end items-center mb-4'>
      <button onClick={toggleTheme} className='text-xl hover:scale-110 transition-transform' aria-label='Toggle Theme'>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
