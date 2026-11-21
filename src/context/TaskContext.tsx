import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { Task, FilterStatus, SortOrder, ToastMessage, ToastType } from '../types/task';
import { taskRepository, type CreateTaskPayload } from '../repositories/taskRepository';
import { useDebounce } from '../hooks/useDebounce';
import { TaskContext } from './taskContextObject';

const LIMIT = 10;
const DUMMY_JSON_MAX_ID = 254;

const PRIORITY_WEIGHT: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const VALID_FILTERS: FilterStatus[] = ['all', 'active', 'completed'];
const VALID_SORTS: SortOrder[] = ['none', 'desc', 'asc'];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = searchParams.get('status') as FilterStatus | null;
  const filter: FilterStatus = rawStatus && VALID_FILTERS.includes(rawStatus) ? rawStatus : 'all';

  const rawSort = searchParams.get('sort') as SortOrder | null;
  const sortOrder: SortOrder = rawSort && VALID_SORTS.includes(rawSort) ? rawSort : 'none';

  const searchQuery = searchParams.get('q') || '';

  const setFilter = useCallback(
    (newFilter: FilterStatus) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newFilter === 'all') {
            next.delete('status');
          } else {
            next.set('status', newFilter);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSortOrder = useCallback(
    (newSort: SortOrder) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newSort === 'none') {
            next.delete('sort');
          } else {
            next.set('sort', newSort);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSearchQuery = useCallback(
    (newQuery: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!newQuery) {
            next.delete('q');
          } else {
            next.set('q', newQuery);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const debouncedSearch = useDebounce(searchQuery, 400);
  const abortControllerRef = useRef<AbortController | null>(null);

  const showToast = useCallback((text: string, type: ToastType = 'info') => {
    setToast({ id: Date.now(), text, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const fetchTasks = useCallback(
    (page = 1) => {
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
    },
    [showToast]
  );

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    taskRepository
      .getAll({ limit: LIMIT, skip: 0, signal: controller.signal })
      .then((data) => {
        setTasks(data.tasks);
        setTotalCount(data.total);
        setCurrentPage(1);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Не вдалося завантажити завдання з сервера.');
          setIsLoading(false);
          showToast('Помилка завантаження даних', 'error');
        }
      });

    return () => {
      controller.abort();
    };
  }, [showToast]);

  const addTask = async (payload: CreateTaskPayload) => {
    try {
      const created = await taskRepository.create(payload);
      const uniqueTask: Task = {
        ...created,
        id: Date.now(),
        createdBy: payload.createdBy || created.createdBy,
        createdAt: new Date().toISOString(),
        isPendingDelete: false,
      };
      setTasks((prev) => [uniqueTask, ...prev]);
      showToast('Завдання успішно додано!', 'success');
    } catch (err) {
      showToast('Помилка при створенні завдання', 'error');
      throw err;
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
    } catch (err) {
      setTasks(previousTasks);
      showToast('Помилка оновлення завдання', 'error');
      throw err;
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

  const confirmDelete = useCallback(
    async (id: number) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));

      try {
        if (id <= DUMMY_JSON_MAX_ID) {
          await taskRepository.delete(id);
        }
        showToast('Завдання остаточно видалено', 'warning');
      } catch {
        showToast('Помилка видалення на сервері', 'error');
      }
    },
    [showToast]
  );

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
    setSearchParams({}, { replace: true });
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
        showToast,
        hideToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};