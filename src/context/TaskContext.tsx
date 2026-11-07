import React, { createContext, useReducer, useEffect, useState, useRef } from 'react';
import {
  type Task,
  type FilterStatus,
  type SortOrder,
  type ToastMessage,
  type ToastType,
} from '../types/task';
import { taskReducer } from '../reducers/taskReducer';
import { initialTasks } from '../data/initialTasks';

export interface TaskContextType {
  tasks: Task[];
  filter: FilterStatus;
  sortOrder: SortOrder;
  toast: ToastMessage | null;
  setFilter: (filter: FilterStatus) => void;
  setSortOrder: (order: SortOrder) => void;
  addTask: (taskData: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (id: number, data: Partial<Omit<Task, 'id'>>) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: (id: number) => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  showToast: (text: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const TaskContext = createContext<TaskContextType | null>(null);

const STORAGE_KEY = 'study_planner_tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, [], () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((t: Task) => ({ ...t, isPendingDelete: false }));
        }
      }
    } catch (e) {
      console.error('Помилка читання з localStorage:', e);
    }
    return initialTasks;
  });

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const deleteTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    try {
      const tasksToSave = tasks.map(({ isPendingDelete, ...task }) => task);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (e) {
      console.error('Помилка збереження у localStorage:', e);
    }
  }, [tasks]);

  useEffect(() => {
    const timers = deleteTimers.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const showToast = (text: string, type: ToastType = 'info') => {
    setToast({ id: Date.now(), text, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    dispatch({ type: 'ADD_TASK', payload: taskData });
    showToast(`Завдання "${taskData.title}" успішно додано!`, 'success');
  };

  const updateTask = (id: number, data: Partial<Omit<Task, 'id'>>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, data } });
    showToast('Завдання успішно відредаговано!', 'success');
  };

  const toggleTask = (id: number) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const requestDelete = (id: number) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    dispatch({ type: 'REQUEST_DELETE', payload: id });
    showToast(`Завдання "${taskToDelete.title}" буде видалено через 5 сек.`, 'warning');

    const timer = setTimeout(() => {
      dispatch({ type: 'CONFIRM_DELETE', payload: id });
      deleteTimers.current.delete(id);
      showToast('Завдання остаточно видалено.', 'info');
    }, 5000);

    deleteTimers.current.set(id, timer);
  };

  const undoDelete = (id: number) => {
    const timer = deleteTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      deleteTimers.current.delete(id);
    }
    dispatch({ type: 'UNDO_DELETE', payload: id });
    showToast('Видалення скасовано.', 'success');
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
    showToast('Виконані завдання очищено.', 'info');
  };

  const resetTasks = () => {
    dispatch({ type: 'RESET_TASKS', payload: initialTasks });
    showToast('Дані скинуто до початкових.', 'info');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filter,
        sortOrder,
        toast,
        setFilter,
        setSortOrder,
        addTask,
        updateTask,
        toggleTask,
        requestDelete,
        undoDelete,
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