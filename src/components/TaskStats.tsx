import React from 'react';
import { type Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;

  return (
    <div className="task-stats">
      <div className="stat-card">
        <span className="stat-value">{total}</span>
        <span className="stat-label">Всього</span>
      </div>
      <div className="stat-card">
        <span className="stat-value text-success">{completed}</span>
        <span className="stat-label">Виконано</span>
      </div>
      <div className="stat-card">
        <span className="stat-value text-warning">{active}</span>
        <span className="stat-label">В процесі</span>
      </div>
    </div>
  );
};