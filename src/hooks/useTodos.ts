import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { todosApi } from '../api/todosApi';
import { loadFromStorage, saveToStorage } from '../utils/Storage';
import { useDebounce } from './useDebounce';

export interface Todo {
  id: number;
  index: number;
  title: string;
  completed: boolean;
  due_date?: string;
}

type Rule<T> = (todo: Partial<T>) => string | null;

export type Filter = 'all' | 'active' | 'completed';
export type Search = string;

const useApi = import.meta.env.VITE_USE_API === 'true';

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return fallback;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => (useApi ? [] : loadFromStorage('todos', [])));
  const [filter, setFilter] = useState<Filter>(() => (useApi ? 'all' : loadFromStorage('filter', 'all')));
  const [search, setSearch] = useState<Search>(() => (useApi ? '' : loadFromStorage('search', '')));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);
  const requestSeq = useRef(0);

  useEffect(() => {
    if (!useApi) saveToStorage('todos', todos);
  }, [todos]);
  useEffect(() => {
    if (!useApi) saveToStorage('filter', filter);
  }, [filter]);
  useEffect(() => {
    if (!useApi) saveToStorage('search', search);
  }, [search]);

  const applyLocalFilter = useCallback((items: Todo[], f: Filter) => {
    switch (f) {
      case 'active':
        return items.filter((t) => !t.completed);
      case 'completed':
        return items.filter((t) => t.completed);
      default:
        return items;
    }
  }, []);

  const rules: Rule<Todo>[] = useMemo(
    () => [
      (todo) => (todo.title?.trim() ? null : 'Title is required'),
      (todo) => (todo.due_date && isNaN(new Date(todo.due_date).getTime()) ? 'Invalid due date' : null),
      (todo) => (todo.due_date && new Date(todo.due_date) < new Date() ? 'Due date must be in the future' : null),
      (todo) =>
        todo.due_date && new Date(todo.due_date) > new Date('2050-01-01')
          ? 'Due date must be before the year 2050'
          : null,
    ],
    []
  );

  const validateTodo = useCallback(
    (todo: Partial<Todo>) => {
      const errors: string[] = rules.map((rule) => rule(todo)).filter((msg): msg is string => msg !== null);
      if (errors.length > 0) {
        setError(errors.join(', '));
        return false;
      }
      setError(null);
      return true;
    },
    [rules]
  );

  const getTodos = useCallback((f: Filter) => (useApi ? todos : applyLocalFilter(todos, f)), [todos, applyLocalFilter]);

  const refresh = useCallback(
    async (overrideSearch?: string, overrideFilter?: Filter) => {
      if (!useApi) return;
      const q = overrideSearch ?? search;
      const f = overrideFilter ?? filter;
      const seq = ++requestSeq.current;
      setLoading(true);
      try {
        const data = await todosApi.list(q || undefined, f === 'all' ? undefined : f);
        if (seq !== requestSeq.current) return;
        setTodos((data as Todo[]).slice().sort((a: Todo, b: Todo) => a.index - b.index));
        setError(null);
      } catch (e) {
        if (seq !== requestSeq.current) return;
        setError(getErrorMessage(e, 'Failed to load todos'));
      } finally {
        if (seq === requestSeq.current) setLoading(false);
      }
    },
    [search, filter]
  );

  useEffect(() => {
    if (useApi && !initialized.current) {
      initialized.current = true;
      refresh();
    }
  }, [refresh]);

  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    if (useApi && initialized.current) {
      refresh(debouncedSearch, filter);
    }
  }, [debouncedSearch, filter, refresh]);

  const addTodo = useCallback(
    async (title: string, due_date?: string) => {
      const trimmed = title.trim();

      if (!validateTodo({ title: trimmed, due_date })) return;

      if (useApi) {
        const tempId = Date.now();
        const optimistic: Todo = {
          id: tempId,
          title: trimmed,
          completed: false,
          due_date: due_date ? new Date(due_date).toISOString() : undefined,
          index: 0,
        };

        try {
          const created = await todosApi.create({
            title: trimmed,
            due_date: optimistic.due_date,
          });

          setError(null);
          setTodos((prev) => {
            const withoutTemp = prev.filter((t) => t.id !== tempId);
            return [created, ...withoutTemp.map((t, i) => ({ ...t, index: i + 1 }))];
          });
        } catch (e) {
          setError(getErrorMessage(e, 'Create failed'));
          // відкотити оптимістичне додавання
          setTodos((prev) => prev.filter((t) => t.id !== tempId).map((t, i) => ({ ...t, index: i })));
        }
        return;
      }

      setTodos((prev) => {
        const newTodo: Todo = {
          id: Date.now(),
          title: trimmed,
          completed: false,
          due_date: due_date ? new Date(due_date).toISOString() : undefined,
          index: 0,
        };
        return [newTodo, ...prev.map((t, i) => ({ ...t, index: i + 1 }))];
      });
    },
    [validateTodo]
  );

  const toggleTodo = useCallback(
    async (id: number) => {
      if (useApi) {
        const current = todos.find((t) => t.id === id);
        if (!current) return;
        const nextCompleted = !current.completed;
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t)));
        try {
          const updated = await todosApi.update(id, { completed: nextCompleted });
          setError(null);
          setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
        } catch (e) {
          setError(getErrorMessage(e, 'Toggle failed'));
          setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: current.completed } : t)));
        }
        return;
      }
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    },
    [todos]
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      if (useApi) {
        const snapshot = todos;
        setTodos((prev) => prev.filter((t) => t.id !== id).map((t, i) => ({ ...t, index: i })));
        try {
          await todosApi.delete(id);
          setError(null);
        } catch (e) {
          setError(getErrorMessage(e, 'Delete failed'));
          setTodos(snapshot);
        }
        return;
      }
      setTodos((prev) => prev.filter((t) => t.id !== id).map((t, i) => ({ ...t, index: i })));
    },
    [todos]
  );

  const updateTodo = useCallback(
    async (id: number, title: string, due_date?: string) => {
      const trimmed = title.trim();

      if (!validateTodo({ id, title: trimmed, due_date })) return;

      if (useApi) {
        const snapshot = todos;
        const isoDue = due_date ? new Date(due_date).toISOString() : undefined;
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title: trimmed, due_date: isoDue } : t)));
        try {
          const updated = await todosApi.update(id, { title: trimmed, due_date: isoDue });
          setError(null);
          setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
        } catch (e) {
          setError(getErrorMessage(e, 'Update failed'));
          setTodos(snapshot);
        }
        return;
      }

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, title: trimmed, due_date: due_date ? new Date(due_date).toISOString() : undefined } : t
        )
      );
    },
    [todos, validateTodo]
  );

  const getFilteredTodos = useCallback(() => {
    if (useApi) {
      return todos.slice().sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.index !== b.index) return a.index - b.index;
        return 0;
      });
    }

    const base = applyLocalFilter(todos, filter);

    const lower = search.toLowerCase();
    return base
      .filter((t) => t.title.toLowerCase().includes(lower))
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.index !== b.index) return a.index - b.index;
        return 0;
      });
  }, [todos, filter, search, applyLocalFilter]);

  const updateOrder = useCallback(
    async (newOrder: Todo[]) => {
      const updated = newOrder.map((t, i) => ({ ...t, index: i }));
      const existingIds = new Set(updated.map((t) => t.id));
      const remaining = todos.filter((t) => !existingIds.has(t.id));
      const finalOrder = [...updated, ...remaining].map((t, i) => ({ ...t, index: i }));

      const snapshot = todos;
      setTodos(finalOrder);

      if (useApi) {
        try {
          await todosApi.reorder(finalOrder.map((t) => t.id));
          setError(null);
        } catch (e) {
          setError(getErrorMessage(e, 'Reorder failed'));
          setTodos(snapshot);
        }
      }
    },
    [todos]
  );

  return {
    useApi,
    loading,
    error,
    refresh,
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
