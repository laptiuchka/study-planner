import { httpClient } from '../api/httpClient';
import type { Task, ApiTodo, TodosResponse, Priority } from '../types/task';

const toTask = (todo: ApiTodo): Task => ({
  id: todo.id,
  title: todo.todo,
  description: '',
  completed: todo.completed,
  priority: 'medium',
  category: 'Загальне',
});

export interface GetTasksParams {
  limit: number;
  skip: number;
  signal?: AbortSignal;
}

export interface GetTasksResult {
  tasks: Task[];
  total: number;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  category: string;
  priority: Priority;
}

export const taskRepository = {
  async getAll({ limit, skip, signal }: GetTasksParams): Promise<GetTasksResult> {
    const data = await httpClient.get<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, { signal });
    return {
      tasks: data.todos.map(toTask),
      total: data.total,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const data = await httpClient.get<ApiTodo>(`/todos/${id}`, { signal });
    return toTask(data);
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    const data = await httpClient.post<ApiTodo>('/todos/add', {
      todo: payload.title,
      completed: false,
      userId: 1,
    });

    return {
      ...toTask(data),
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
    };
  },

  async update(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Partial<Task>> {
    const apiPayload: Partial<ApiTodo> = {};
    if (updates.title !== undefined) apiPayload.todo = updates.title;
    if (updates.completed !== undefined) apiPayload.completed = updates.completed;

    if (Object.keys(apiPayload).length > 0) {
      await httpClient.put<ApiTodo>(`/todos/${id}`, apiPayload);
    }

    return updates;
  },

  async delete(id: number): Promise<{ id: number; isDeleted: boolean }> {
    return httpClient.delete<{ id: number; isDeleted: boolean }>(`/todos/${id}`);
  },
};