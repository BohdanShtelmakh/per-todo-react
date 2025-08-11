import { useState } from 'react';

interface Props {
  addTodo: (title: string, dueDate?: string) => void;
}

export default function TodoForm({ addTodo }: Props) {
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    addTodo(value, dueDate);
    setValue('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4'>
      <input
        type='text'
        className='flex-1 p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Enter a task...'
      />
      <input
        type='date'
        className='p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 dark:[color-scheme:dark]'
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button
        type='submit'
        className='w-full sm:w-auto px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-700'
      >
        Add
      </button>
    </form>
  );
}
