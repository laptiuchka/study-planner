import React from 'react';
import { type FilterStatus } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  sortOrder: 'none' | 'desc' | 'asc';
  onSortChange: (order: 'none' | 'desc' | 'asc') => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="task-filters">
      <button
        className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        Всі
      </button>
      <button
        className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
        onClick={() => onFilterChange('active')}
      >
        Невиконані
      </button>
      <button
        className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        Виконані
      </button>
      <select
        className="sort-select"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value as 'none' | 'desc' | 'asc')}
      >
        <option value="none">Без сортування</option>
        <option value="desc">Пріоритет (високий ➔ низький)</option>
        <option value="asc">Пріоритет (низький ➔ високий)</option>
      </select>
    </div>
  );
};