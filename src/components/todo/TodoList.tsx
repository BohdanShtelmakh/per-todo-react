import { AnimatePresence, motion } from 'framer-motion';
import type { Todo } from '../../hooks/useTodos';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, text: string) => void;
}

export default function TodoList({ todos, toggleTodo, deleteTodo, updateTodo }: Props) {
  return (
    <ul className='todo-list list-none p-0'>
      {todos.length === 0 ? (
        <p>No tasks yet ✨</p>
      ) : (
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className='todo-item'
            >
              <TodoItem todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} updateTodo={updateTodo} />
            </motion.li>
          ))}
        </AnimatePresence>
      )}
    </ul>
  );
}
