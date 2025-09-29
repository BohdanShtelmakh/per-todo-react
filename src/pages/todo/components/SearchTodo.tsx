export default function SearchTodo({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return (
    <div className='mb-4 justify-center items-center flex relative w-full max-w-screen-md'>
      <input
        type='text'
        className='flex-1 w-full p-2 pr-8 border rounded dark:bg-zinc-800 dark:border-zinc-600'
        placeholder='Search tasks...'
        value={search}
        onKeyDown={({ key }: React.KeyboardEvent<HTMLInputElement>) => {
          if (key === 'Escape') {
            setSearch('');
          }
        }}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 text-lg'
          aria-label='Clear search'
        >
          ❌
        </button>
      )}
    </div>
  );
}
