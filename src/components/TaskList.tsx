import React from 'react';
import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { filteredTasks, isLoading, error, currentPage, fetchTasks } = useTaskContext();

  if (isLoading) {
    return (
      <div className="task-list__state task-list__state--loading" style={{ textAlign: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list__state task-list__state--error" style={{ textAlign: 'center', padding: '2rem', color: '#dc3545' }}>
        <p>{error}</p>
        <button
          type="button"
          className="task-list__retry-btn"
          onClick={() => fetchTasks(currentPage)}
          style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Спробувати ще
        </button>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="task-list__state task-list__state--empty" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        Завдань не знайдено.
      </div>
    );
  }

  return (
    <ul className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEditTask} />
      ))}
    </ul>
  );
};