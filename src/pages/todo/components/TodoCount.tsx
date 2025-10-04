import type { Todo } from '../../../hooks/useTodos';

interface Props {
  getTodosCount: (filter: 'all' | 'active' | 'completed') => Todo[];
}

export default function TodoCount({ getTodosCount }: Props) {
  return (
    <div className='flex justify-center gap-1 mb-2'>
      <p className='text-center my-4 font-semibold'>Completed Tasks: {getTodosCount('completed').length}</p>
      <p className='text-center my-4 font-semibold'>Tasks Left: {getTodosCount('active').length}</p>
    </div>
  );
}
