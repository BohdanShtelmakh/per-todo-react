import { api } from '../utils/Axios';

export interface TodoDTO {
  id: number;
  index: number;
  title: string;
  completed: boolean;
  due_date?: string;
}

export const todosApi = {
  list: async (search?: string, status?: 'all' | 'active' | 'completed') => {
    const res = await api.get<{ todos: TodoDTO[] }>('/todo', {
      params: { search, status },
    });
    console.log(res);

    return res.data.todos;
  },
  create: async (data: { title: string; due_date?: string }) => {
    const res = await api.post<{ todo: TodoDTO }>('/todo', data);
    return res.data.todo;
  },
  update: async (id: number, data: Partial<Pick<TodoDTO, 'title' | 'completed' | 'due_date'>>) => {
    const res = await api.patch<{ todo: TodoDTO }>(`/todo/${id}`, data);
    return res.data.todo;
  },
  delete: async (id: number) => {
    await api.delete(`/todo/${id}`);
  },
  reorder: async (orderedIds: number[]) => {
    const res = await api.post<{ todos: TodoDTO[] }>('/todo/reorder', { ids: orderedIds });
    return res.data.todos;
  },
  // toggle: async (id: number) => {
  //   const res = await api.patch<TodoDTO>(`/todos/${id}/toggle`);
  //   return res.data;
  // },
};
