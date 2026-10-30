import React from 'react';
import { type Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className={`badge priority-${task.priority}`}>
            {task.priority}
          </span>
          <span className="badge category-badge">{task.category}</span>
        </div>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>
      <div className="task-actions">
        <button
          className={`btn ${task.completed ? 'btn-secondary' : 'btn-success'}`}
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? 'Повернути' : 'Виконано'}
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
          Видалити
        </button>
      </div>
    </div>
  );
};