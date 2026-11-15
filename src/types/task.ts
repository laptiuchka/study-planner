export type Priority = 'low' | 'medium' | 'high';
export type FilterStatus = 'all' | 'active' | 'completed';
export type SortOrder = 'none' | 'desc' | 'asc';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  completed: boolean;
  isPendingDelete?: boolean;
}

export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}