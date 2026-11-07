import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskStats.scss';

export const TaskStats: React.FC = () => {
  const { tasks } = useTaskContext();

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;

  return (
    <div className="task-stats">
      <div className="task-stats__card">
        <span className="task-stats__value">{total}</span>
        <span className="task-stats__label">Всього</span>
      </div>
      <div className="task-stats__card">
        <span className="task-stats__value task-stats__value--success">{completed}</span>
        <span className="task-stats__label">Виконано</span>
      </div>
      <div className="task-stats__card">
        <span className="task-stats__value task-stats__value--warning">{active}</span>
        <span className="task-stats__label">В процесі</span>
      </div>
    </div>
  );
};