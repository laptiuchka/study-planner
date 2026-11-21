import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import { useAuth } from '../hooks/useAuth';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTask, requestDelete, undoDelete, confirmDelete, showToast } = useTaskContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!task.isPendingDelete) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          confirmDelete(task.id);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [task.isPendingDelete, task.id, confirmDelete]);

  const requireAuthAction = (action: () => void) => {
    if (!isAuthenticated) {
      showToast('Увійдіть у систему, щоб змінювати завдання', 'warning');
      navigate('/login', { state: { from: location } });
      return;
    }
    action();
  };

  const handleRequestDelete = () => {
    setSecondsLeft(5);
    requestDelete(task.id);
  };

  const handleUndoDelete = () => {
    setSecondsLeft(5);
    undoDelete(task.id);
  };

  if (task.isPendingDelete) {
    return (
      <li className="task-item task-item--pending-delete">
        <div className="task-item__pending-info">
          <span className="task-item__pending-text">
            Завдання «<strong>{task.title}</strong>» буде видалено через {secondsLeft} с...
          </span>
          <div className="task-item__progress-bar">
            <div className="task-item__progress-fill" />
          </div>
        </div>
        <button
          type="button"
          className="task-item__btn task-item__btn--undo"
          onClick={handleUndoDelete}
        >
          Скасувати
        </button>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__content">
        <input
          type="checkbox"
          className="task-item__checkbox"
          checked={task.completed}
          onChange={() => requireAuthAction(() => toggleTask(task.id))}
          aria-label={`Позначити "${task.title}" як виконане`}
        />
        <div>
          <div className="task-item__header">
            <Link to={`/tasks/${task.id}`} className="task-item__title">
              {task.title}
            </Link>
            <span className={`task-item__badge task-item__badge--${task.priority}`}>
              {PRIORITY_LABELS[task.priority] || task.priority}
            </span>
            <span className="task-item__badge task-item__badge--category">
              {task.category}
            </span>
          </div>
          {task.description && (
            <p className="task-item__description">{task.description}</p>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        <Link
          to={`/tasks/${task.id}`}
          className="task-item__btn task-item__btn--secondary"
        >
          Деталі
        </Link>
        <button
          type="button"
          className="task-item__btn task-item__btn--edit"
          onClick={() => requireAuthAction(() => onEdit(task))}
        >
          Редагувати
        </button>
        <button
          type="button"
          className="task-item__btn task-item__btn--danger"
          onClick={() => requireAuthAction(handleRequestDelete)}
        >
          Видалити
        </button>
      </div>
    </li>
  );
};