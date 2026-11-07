import React from 'react';
import { type Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTask, requestDelete, undoDelete } = useTaskContext();

  if (task.isPendingDelete) {
    return (
      <div className="task-item task-item--pending-delete">
        <div className="task-item__pending-info">
          <span className="task-item__pending-text">
            Завдання <strong>"{task.title}"</strong> буде видалено...
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
          Скасувати (Undo)
        </button>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__content">
        <div className="task-item__header">
          <h3 className="task-item__title">{task.title}</h3>
          <span className={`task-item__badge task-item__badge--${task.priority}`}>
            {task.priority === 'high' ? 'Високий' : task.priority === 'medium' ? 'Середній' : 'Низький'}
          </span>
          <span className="task-item__badge task-item__badge--category">
            {task.category}
          </span>
        </div>
        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className={`task-item__btn ${task.completed ? 'task-item__btn--secondary' : 'task-item__btn--success'}`}
          onClick={() => toggleTask(task.id)}
        >
          {task.completed ? 'Повернути' : 'Виконано'}
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
    </div>
  );
};