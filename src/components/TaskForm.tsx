import React, { useState, useEffect } from 'react';
import { type Priority, type Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskForm.scss';

interface TaskFormProps {
  editingTask?: Task | null;
  onCancelEdit?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ editingTask, onCancelEdit }) => {
  const { addTask, updateTask } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'Загальне',
        priority,
      });
      if (onCancelEdit) onCancelEdit();
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'Загальне',
        priority,
      });
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form__title">
        {editingTask ? 'Редагувати завдання' : 'Додати нове завдання'}
      </h2>

      <div className="task-form__group">
        <input
          type="text"
          className="task-form__input"
          placeholder="Назва завдання *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="task-form__group">
        <textarea
          className="task-form__textarea"
          placeholder="Опис завдання"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__group">
          <label className="task-form__label">Категорія</label>
          <input
            type="text"
            className="task-form__input"
            placeholder="Наприклад, React"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="task-form__group">
          <label className="task-form__label">Пріоритет</label>
          <select
            className="task-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      <div className="task-form__actions">
        <button type="submit" className="task-form__button task-form__button--primary">
          {editingTask ? 'Зберегти зміни' : 'Додати завдання'}
        </button>
        {editingTask && onCancelEdit && (
          <button
            type="button"
            className="task-form__button task-form__button--secondary"
            onClick={onCancelEdit}
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
};