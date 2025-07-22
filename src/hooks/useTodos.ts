import { useCallback, useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/Storage';
import { useDebounce } from './useDebounce';

export interface Todo {
  id: number;
  index: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export type Filter = 'all' | 'active' | 'completed';

export type Search = string;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadFromStorage('todos', []));
  const [filter, setFilter] = useState<Filter>(() => loadFromStorage('filter', 'all'));
  const [search, setSearch] = useState<Search>(() => loadFromStorage('search', ''));

  useEffect(() => {
    saveToStorage<Todo[]>('todos', todos);
  }, [todos]);

  useEffect(() => {
    saveToStorage<Filter>('filter', filter);
  }, [filter]);

  useEffect(() => {
    saveToStorage<Search>('search', search);
  }, [search]);

  const addTodo = (text: string, dueDate?: string) => {
    const trimmed = text.trim();
    if (!trimmed || todos.some((t) => t.text === trimmed)) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      dueDate,
      index: todos.length,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const updateTodo = useCallback((id: number, text: string, dueDate?: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text, dueDate } : todo)));
  }, []);

  const getTodos = (filter: Filter) => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const debouncedSearch = useDebounce(search, 300);

  const getFilteredTodos = () => {
    const lowerSearch = debouncedSearch.toLowerCase();
    return getTodos(filter)
      .filter((todo) => todo.text.toLowerCase().includes(lowerSearch))
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // if (a.dueDate && b.dueDate) {
        //   return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        // }
        if (a.index !== b.index) {
          return a.index - b.index;
        }

        // if (a.dueDate) return -1;
        // if (b.dueDate) return 1;
        return 0;
      });
  };

  const updateOrder = (newOrder: Todo[]) => {
    const existingIds = new Set(newOrder.map((todo) => todo.id));
    const missingTodos = todos.filter((todo) => !existingIds.has(todo.id));
    const combinedOrder = [...newOrder, ...missingTodos];

    const updatedTodos = combinedOrder.map((todo, index) => ({
      ...todo,
      index,
    }));
    setTodos(updatedTodos);
  };

  return {
    todos,
    filter,
    setFilter,
    search,
    setSearch,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    getTodos,
    getFilteredTodos,
    updateOrder,
  };
}
