import { useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/Storage';
import { useDebounce } from './useDebounce';

export interface Todo {
  id: number;
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
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      dueDate,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: number, text: string, dueDate?: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text, dueDate } : todo)));
  };

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
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
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
  };
}
