import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { Todo } from '../../hooks/useTodos';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, title: string, dueDate?: string) => void;
  updateOrder: (newOrder: Todo[]) => void;
}

export default function TodoList({ todos, toggleTodo, deleteTodo, updateTodo, updateOrder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const oldIndex = todos.findIndex((item) => item.index === active.id);
      const newIndex = todos.findIndex((item) => item.index === over.id);
      const newOrder = arrayMove(todos, oldIndex, newIndex);

      updateOrder(newOrder);
    }
    setIsDragging(false);
  };

  return (
    <ul className='todo-list list-none p-0 max-h-[400px] overflow-y-auto overscroll-contain'>
      {todos.length === 0 ? (
        <p>No tasks yet ✨</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todos.filter((todo) => !todo.completed).map((todo) => todo.index)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {todos.map((todo) => (
                <motion.li
                  key={todo.id}
                  layout={!isDragging}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className='todo-item'
                >
                  <TodoItem
                    todo={todo}
                    key={todo.index}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                    updateTodo={updateTodo}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      )}
    </ul>
  );
}
