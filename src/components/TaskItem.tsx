import React, { useEffect, useState } from 'react';
import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
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
  const { toggleTask, requestDelete, undoDelete, confirmDelete, selectTask } = useTaskContext();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!task.isPendingDelete) {
      setSecondsLeft(5);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          confirmDelete(task.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [task.isPendingDelete, task.id, confirmDelete]);

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
          onClick={() => undoDelete(task.id)}
        >
          Скасувати
        </button>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__content" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <input
          type="checkbox"
          className="task-item__checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          style={{ marginTop: '5px', width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent)' }}
        />
        <div>
          <div className="task-item__header">
            <span
              className="task-item__title"
              onClick={() => selectTask(task.id)}
              style={{ cursor: 'pointer' }}
            >
              {task.title}
            </span>
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
        <button
          type="button"
          className="task-item__btn task-item__btn--secondary"
          onClick={() => selectTask(task.id)}
        >
          Деталі
        </button>
        <button
          type="button"
          className="task-item__btn task-item__btn--edit"
          onClick={() => onEdit(task)}
        >
          Редагувати
        </button>
        <button
          type="button"
          className="task-item__btn task-item__btn--danger"
          onClick={() => requestDelete(task.id)}
        >
          Видалити
        </button>
      </div>
    </li>
  );
};