import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Task, FilterStatus, SortOrder, ToastMessage, ToastType } from '../types/task';
import { taskRepository, type CreateTaskPayload } from '../repositories/taskRepository';
import { useDebounce } from '../hooks/useDebounce';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  selectedTaskId: number | null;
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
  selectTask: (id: number | null) => void;
  hideToast: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LIMIT = 10;
const DUMMY_JSON_MAX_ID = 254;

const PRIORITY_WEIGHT: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const abortControllerRef = useRef<AbortController | null>(null);

  const showToast = useCallback((text: string, type: ToastType = 'info') => {
    setToast({ id: Date.now(), text, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const fetchTasks = useCallback((page = 1) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    const skip = (page - 1) * LIMIT;

    taskRepository
      .getAll({ limit: LIMIT, skip, signal: controller.signal })
      .then((data) => {
        setTasks(data.tasks);
        setTotalCount(data.total);
        setCurrentPage(page);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Не вдалося завантажити завдання з сервера.');
          setIsLoading(false);
          showToast('Помилка завантаження даних', 'error');
        }
      });
  }, [showToast]);

  useEffect(() => {
    fetchTasks(1);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchTasks]);

  const addTask = async (payload: CreateTaskPayload) => {
    try {
      const created = await taskRepository.create(payload);
      const uniqueTask: Task = { ...created, id: Date.now(), isPendingDelete: false };
      setTasks((prev) => [uniqueTask, ...prev]);
      showToast('Завдання успішно додано!', 'success');
    } catch {
      showToast('Помилка при створенні завдання', 'error');
    }
  };

  const toggleTask = async (id: number) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const newCompleted = !target.completed;
    const previousTasks = [...tasks];

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    try {
      if (id <= DUMMY_JSON_MAX_ID) {
        await taskRepository.update(id, { completed: newCompleted });
      }
      showToast(newCompleted ? 'Завдання виконано!' : 'Завдання повернуто в роботу', 'info');
    } catch {
      setTasks(previousTasks);
      showToast('Не вдалося оновити статус', 'error');
    }
  };

  const updateTask = async (id: number, data: Partial<Omit<Task, 'id'>>) => {
    const previousTasks = [...tasks];

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );

    try {
      if (id <= DUMMY_JSON_MAX_ID) {
        await taskRepository.update(id, data);
      }
      showToast('Завдання оновлено!', 'success');
    } catch {
      setTasks(previousTasks);
      showToast('Помилка оновлення завдання', 'error');
    }
  };

  const requestDelete = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPendingDelete: true } : t))
    );
  };

  const undoDelete = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPendingDelete: false } : t))
    );
    showToast('Видалення скасовано', 'info');
  };

  const confirmDelete = useCallback(async (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      if (id <= DUMMY_JSON_MAX_ID) {
        await taskRepository.delete(id);
      }
      showToast('Завдання остаточно видалено', 'warning');
    } catch {
      showToast('Помилка видалення на сервері', 'error');
    }
  }, [showToast]);

  const clearCompleted = async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    if (completedIds.length === 0) {
      showToast('Немає виконаних завдань для очищення', 'info');
      return;
    }

    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast(`Очищено виконаних завдань: ${completedIds.length}`, 'warning');
  };

  const resetTasks = () => {
    setFilter('all');
    setSortOrder('none');
    setSearchQuery('');
    fetchTasks(1);
    showToast('Список оновлено з сервера', 'info');
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    if (sortOrder !== 'none') {
      result.sort((a, b) => {
        const diff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        return sortOrder === 'desc' ? diff : -diff;
      });
    }

    return result;
  }, [tasks, filter, debouncedSearch, sortOrder]);

  const totalPages = Math.ceil(totalCount / LIMIT) || 1;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        isLoading,
        error,
        currentPage,
        totalPages,
        selectedTaskId,
        filter,
        sortOrder,
        searchQuery,
        toast,
        setFilter,
        setSortOrder,
        setSearchQuery,
        fetchTasks,
        addTask,
        toggleTask,
        updateTask,
        requestDelete,
        undoDelete,
        confirmDelete,
        clearCompleted,
        resetTasks,
        selectTask: setSelectedTaskId,
        hideToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};