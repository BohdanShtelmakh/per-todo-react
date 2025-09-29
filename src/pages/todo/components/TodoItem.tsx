import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef, useState } from 'react';
import type { Todo } from '../../../hooks/useTodos';

interface Props {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, title: string, due_date?: string) => void;
}

export default function TodoItem({ todo, toggleTodo, deleteTodo, updateTodo }: Props) {
  // const isMobile = useIsMobile();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [editDate, setEditDate] = useState(todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : '');
  const containerRef = useRef<HTMLDivElement>(null);

  let pressTimer: NodeJS.Timeout;

  const handleBlurContainer = (e: React.FocusEvent<HTMLDivElement>) => {
    const nextFocusTarget = e.relatedTarget as Node | null;
    if (!containerRef.current?.contains(nextFocusTarget)) {
      handleSave();
      setIsEditing(false);
    }
  };

  const handleTouchStart = () => {
    pressTimer = setTimeout(() => setIsEditing(true), 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  const handleEdit = () => {
    // if (isMobile) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo(todo.id, editText.trim(), editDate);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  const handleDueDateColor = () => {
    if (!todo.due_date || todo.completed) return 'text-gray-400';
    const dueDate = new Date(todo.due_date);
    const today = new Date();
    if (dueDate < today) return 'text-red-400 dark:text-red-500';
    if (dueDate.toDateString() === today.toDateString()) return 'text-yellow-300 dark:text-yellow-400';
    return 'text-green-300 dark:text-green-400';
  };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex justify-between items-center py-2 border-b border-gray-300 dark:border-zinc-700'
    >
      {!todo.completed ? (
        <div {...attributes} {...listeners} className='cursor-grab me-2 select-none' style={{ touchAction: 'none' }}>
          ☰
        </div>
      ) : (
        ''
      )}
      <div className='flex-1 overflow-hidden'>
        {isEditing ? (
          <div
            ref={containerRef}
            onBlur={handleBlurContainer}
            className='flex items-center gap-2'
            tabIndex={-1} // потрібно, щоб div міг отримати фокус і втратити
          >
            <input
              type='date'
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              onKeyDown={handleKeyDown}
              className='p-2 rounded border bg-white text-black border-gray-300 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:[color-scheme:dark]'
            />
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className='w-full p-2 rounded border bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-white dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:focus:ring-zinc-600'
            />
          </div>
        ) : (
          <div
            className='flex items-center'
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleEdit}
          >
            <span className={`${isEditing ? 'hidden' : ''} text-sm ${handleDueDateColor()}`}>
              {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : 'No due date'}
            </span>
            <span className={`ms-2 ${todo.completed ? 'line-through text-gray-500' : ''}`}>{todo.title}</span>
          </div>
        )}
      </div>
      <div className='flex gap-2 ms-2'>
        <button className='text-green-600 hover:text-green-800' onClick={() => toggleTodo(todo.id)}>
          ✅
        </button>
        <button className='text-blue-500 hover:text-blue-700' onClick={() => handleEdit()} disabled={isEditing}>
          ✏️
        </button>
        <button className='text-red-500 hover:text-red-700' onClick={() => deleteTodo(todo.id)}>
          ❌
        </button>
      </div>
    </div>
  );
}
