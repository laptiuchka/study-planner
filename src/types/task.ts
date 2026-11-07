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

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'completed'> }
  | { type: 'TOGGLE_TASK'; payload: number }
  | { type: 'UPDATE_TASK'; payload: { id: number; data: Partial<Omit<Task, 'id'>> } }
  | { type: 'REQUEST_DELETE'; payload: number }
  | { type: 'CONFIRM_DELETE'; payload: number }
  | { type: 'UNDO_DELETE'; payload: number }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'RESET_TASKS'; payload: Task[] };