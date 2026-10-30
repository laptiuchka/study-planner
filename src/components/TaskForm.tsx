import React, { useState } from 'react';
import { type Priority, type Task } from '../types/task';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'Загальне',
      priority,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Додати нове завдання</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Назва завдання *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Опис завдання"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="input-group">
          <label>Категорія</label>
          <input
            type="text"
            placeholder="Наприклад, React"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Пріоритет</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Додати завдання
      </button>
    </form>
  );
};