import type { Filter } from '../../../hooks/useTodos';

interface Props {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

export default function TodoFilter({ filter, setFilter }: Props) {
  const isActive = (currentFilter: Filter) => {
    return filter === currentFilter
      ? 'bg-zinc-800 text-white dark:bg-zinc-600'
      : 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-gray-200';
  };
  return (
    <div className='flex justify-center gap-2 mb-4'>
      <button
        className={`px-3 py-1 rounded transition-colors
          ${isActive('all')}`}
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button
        className={`px-3 py-1 rounded transition-colors
          ${isActive('active')}`}
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button
        className={`px-3 py-1 rounded transition-colors
          ${isActive('completed')}`}
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>
  );
}
