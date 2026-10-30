import React from 'react';
import { type Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTasksCount,
  onToggleTask,
  onDeleteTask,
}) => {
  if (totalTasksCount === 0) {
    return (
      <div className="empty-state">
        <p>Завдань поки немає. Додайте перше навчальне завдання.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>За цим фільтром немає завдань.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};