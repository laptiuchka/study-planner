import React from 'react';
import { type FilterStatus, type SortOrder } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskFilters.scss';

export const TaskFilters: React.FC = () => {
  const { filter, setFilter, sortOrder, setSortOrder, clearCompleted, resetTasks } = useTaskContext();

  return (
    <div className="task-filters">
      <div className="task-filters__buttons">
        <button
          type="button"
          className={`task-filters__btn ${filter === 'all' ? 'task-filters__btn--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Всі
        </button>
        <button
          type="button"
          className={`task-filters__btn ${filter === 'active' ? 'task-filters__btn--active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Невиконані
        </button>
        <button
          type="button"
          className={`task-filters__btn ${filter === 'completed' ? 'task-filters__btn--active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Виконані
        </button>
      </div>

      <div className="task-filters__controls">
        <select
          className="task-filters__select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        >
          <option value="none">Без сортування</option>
          <option value="desc">Пріоритет (високий ➔ низький)</option>
          <option value="asc">Пріоритет (низький ➔ високий)</option>
        </select>

        <button
          type="button"
          className="task-filters__action-btn"
          onClick={clearCompleted}
          title="Очистити виконані завдання"
        >
          Очистити виконані
        </button>

        <button
          type="button"
          className="task-filters__action-btn task-filters__action-btn--reset"
          onClick={resetTasks}
          title="Скинути до початкових даних"
        >
          Скинути дані
        </button>
      </div>
    </div>
  );
};