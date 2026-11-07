import React from 'react';
import { type Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { tasks, filter, sortOrder } = useTaskContext();

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  if (sortOrder !== 'none') {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    filteredTasks.sort((a, b) => {
      if (sortOrder === 'desc') {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    });
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>Завдань поки немає. Додайте перше навчальне завдання</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>За обраним фільтром завдань не знайдено.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEditTask} />
      ))}
    </div>
  );
};