import React, { useEffect, useState } from 'react';
import { taskRepository } from '../repositories/taskRepository';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';
import './TaskDetailsModal.scss';

interface TaskDetailsModalProps {
  taskId: number | null;
  onClose: () => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ taskId, onClose }) => {
  const { tasks } = useTaskContext();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const localTask = tasks.find((t) => t.id === taskId);

    if (taskId > 254 && localTask) {
      setTask(localTask);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    taskRepository
      .getById(taskId, controller.signal)
      .then((apiTask) => {
        setTask({
          ...apiTask,
          description: localTask?.description || apiTask.description,
          category: localTask?.category || apiTask.category,
          priority: localTask?.priority || apiTask.priority,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Не вдалося завантажити деталі завдання.');
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [taskId, tasks]);

  if (!taskId) return null;

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <button className="task-modal__close" onClick={onClose}>
          &times;
        </button>

        {isLoading && <p className="task-modal__status">Завантаження деталей...</p>}

        {error && (
          <div className="task-modal__error">
            <p>{error}</p>
          </div>
        )}

        {task && !isLoading && !error && (
          <div className="task-modal__content">
            <h2 className="task-modal__title">{task.title}</h2>
            <div className="task-modal__field">
              <strong>ID:</strong> {task.id}
            </div>
            <div className="task-modal__field">
              <strong>Статус:</strong> {task.completed ? 'Виконано' : 'В процесі'}
            </div>
            <div className="task-modal__field">
              <strong>Категорія:</strong> {task.category || 'Загальне'}
            </div>
            <div className="task-modal__field">
              <strong>Пріоритет:</strong> {PRIORITY_LABELS[task.priority] || task.priority}
            </div>
            <div className="task-modal__field">
              <strong>Опис:</strong> {task.description || 'Опис відсутній'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};