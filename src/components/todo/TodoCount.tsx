import type { Todo } from "../../hooks/useTodos";


interface Props {
  getTodos: (filter: 'all' | 'active' | 'completed') => Todo[];
}

export default function TodoCount({ getTodos }: Props) {
  return (
    <div className='flex justify-center gap-1 mb-2'>
      <p className='text-center my-4 font-semibold'>Completed Tasks: {getTodos('completed').length}</p>
      <p className='text-center my-4 font-semibold'>Tasks Left: {getTodos('active').length}</p>
    </div>
  );
}
