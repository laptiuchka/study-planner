import { createContext } from 'react';
import type { Task, FilterStatus, SortOrder, ToastMessage, ToastType } from '../types/task';
import type { CreateTaskPayload } from '../repositories/taskRepository';

export interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filter: FilterStatus;
  sortOrder: SortOrder;
  searchQuery: string;
  toast: ToastMessage | null;
  setFilter: (filter: FilterStatus) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  setSearchQuery: (query: string) => void;
  fetchTasks: (page?: number) => void;
  addTask: (payload: CreateTaskPayload) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  updateTask: (id: number, data: Partial<Omit<Task, 'id'>>) => Promise<void>;
  requestDelete: (id: number) => void;
  undoDelete: (id: number) => void;
  confirmDelete: (id: number) => Promise<void>;
  clearCompleted: () => Promise<void>;
  resetTasks: () => void;
  showToast: (text: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);