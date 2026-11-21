import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router';
import { taskRepository } from '../repositories/taskRepository';
import { useTaskContext } from '../hooks/useTaskContext';
import { useAuth } from '../hooks/useAuth';
import { TaskFormDialog } from '../components/TaskFormDialog';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';
import './TaskDetailsPage.scss';

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { tasks, updateTask, confirmDelete, showToast } = useTaskContext();
  const { isAuthenticated } = useAuth();

  const numericId = Number(taskId);
  const isInvalidId = !taskId || Number.isNaN(numericId);

  const [fetchedTask, setFetchedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!isInvalidId);
  const [error, setError] = useState<string | null>(
    isInvalidId ? 'Некоректний ідентифікатор завдання.' : null
  );
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const localTask = !isInvalidId ? tasks.find((t) => t.id === numericId) : undefined;

  useEffect(() => {
    if (isInvalidId) return;

    if (numericId > 254 && localTask) {
      return;
    }

    const controller = new AbortController();

    taskRepository
      .getById(numericId, controller.signal)
      .then((apiTask) => {
        setFetchedTask(apiTask);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          if (!localTask) {
            setError('Не вдалося завантажити деталі завдання.');
          }
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isInvalidId, numericId, localTask]);

  const task: Task | null = localTask
    ? {
        ...fetchedTask,
        ...localTask,
      }
    : fetchedTask;

  const showLoading = isLoading && !task && !error;

  const handleEditClick = () => {
    if (!isAuthenticated) {
      showToast('Увійдіть у систему, щоб редагувати завдання', 'warning');
      navigate('/login', { state: { from: location } });
      return;
    }
    setIsEditOpen(true);
  };

  const handleDeleteClick = async () => {
    if (!isAuthenticated) {
      showToast('Увійдіть у систему, щоб видаляти завдання', 'warning');
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!task) return;
    await confirmDelete(task.id);
    navigate('/tasks');
  };

  const handleEditSubmit = async (data: TaskFormData) => {
    if (!task) return;
    await updateTask(task.id, data);
    setFetchedTask((prev) => (prev ? { ...prev, ...data } : prev));
  };

  return (
    <section className="task-details">
      <div className="task-details__top">
        <Link to="/tasks" className="task-details__back-link">
          &larr; Повернутися до списку
        </Link>
      </div>

      {showLoading && (
        <div className="task-details__card">
          <p className="task-details__status">Завантаження деталей завдання...</p>
        </div>
      )}

      {error && !task && !showLoading && (
        <div className="task-details__card task-details__card--error">
          <p>{error}</p>
        </div>
      )}

      {task && !showLoading && (
        <div className="task-details__card">
          <div className="task-details__header">
            <div>
              <span className="task-details__id">Завдання #{task.id}</span>
              <h2 className="task-details__title">{task.title}</h2>
            </div>

            <div className="task-details__actions">
              <button
                type="button"
                className="task-details__btn task-details__btn--edit"
                onClick={handleEditClick}
              >
                Редагувати
              </button>
              <button
                type="button"
                className="task-details__btn task-details__btn--danger"
                onClick={handleDeleteClick}
              >
                Видалити
              </button>
            </div>
          </div>

          <div className="task-details__grid">
            <div className="task-details__item">
              <span className="task-details__label">Стан виконання</span>
              <span
                className={`task-details__status-pill ${
                  task.completed
                    ? 'task-details__status-pill--done'
                    : 'task-details__status-pill--active'
                }`}
              >
                {task.completed ? 'Виконано' : 'У процесі'}
              </span>
            </div>

            <div className="task-details__item">
              <span className="task-details__label">Категорія</span>
              <span className="task-details__value">{task.category || 'Загальне'}</span>
            </div>

            <div className="task-details__item">
              <span className="task-details__label">Пріоритет</span>
              <span className="task-details__value">
                {PRIORITY_LABELS[task.priority] || task.priority}
              </span>
            </div>

            <div className="task-details__item">
              <span className="task-details__label">Хто створив завдання</span>
              <span className="task-details__value">{task.createdBy}</span>
            </div>

            <div className="task-details__item">
              <span className="task-details__label">Дата створення</span>
              <span className="task-details__value">
                {new Date(task.createdAt).toLocaleString('uk-UA')}
              </span>
            </div>
          </div>

          <div className="task-details__description-box">
            <span className="task-details__label">Опис завдання</span>
            <p className="task-details__description">
              {task.description || 'Опис для цього завдання ще не додано.'}
            </p>
          </div>
        </div>
      )}

      {task && (
        <TaskFormDialog
          open={isEditOpen}
          mode="edit"
          task={task}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </section>
  );
};