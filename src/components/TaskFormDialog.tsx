import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../schemas/taskSchema';
import type { Task } from '../types/task';
import './TaskFormDialog.scss';

export interface TaskFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  mode,
  task,
  onClose,
  onSubmit,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Загальне',
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && task) {
      reset({
        title: task.title,
        description: task.description || '',
        category: task.category || 'Загальне',
        priority: task.priority,
      });
    } else {
      reset({
        title: '',
        description: '',
        category: 'Загальне',
        priority: 'medium',
      });
    }

    const focusTimer = setTimeout(() => {
      setFocus('title');
    }, 30);

    return () => clearTimeout(focusTimer);
  }, [open, mode, task, reset, setFocus]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isSubmitting, onClose]);

  if (!open) return null;

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div
      className="task-dialog-overlay"
      onClick={() => !isSubmitting && onClose()}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="task-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-dialog__header">
          <h2 id="task-dialog-title" className="task-dialog__title">
            {mode === 'edit' ? 'Редагувати завдання' : 'Нове завдання'}
          </h2>
          <button
            type="button"
            className="task-dialog__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Закрити діалог"
          >
            &times;
          </button>
        </div>

        <form className="task-dialog__form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className="task-dialog__group">
            <label className="task-dialog__label" htmlFor="task-title">
              Назва завдання *
            </label>
            <input
              id="task-title"
              type="text"
              className={`task-dialog__input ${errors.title ? 'task-dialog__input--error' : ''}`}
              placeholder="Наприклад, Підготувати звіт з React Router"
              disabled={isSubmitting}
              {...register('title')}
            />
            {errors.title && (
              <span className="task-dialog__error">{errors.title.message}</span>
            )}
          </div>

          <div className="task-dialog__group">
            <label className="task-dialog__label" htmlFor="task-description">
              Опис
            </label>
            <textarea
              id="task-description"
              className={`task-dialog__textarea ${errors.description ? 'task-dialog__input--error' : ''}`}
              placeholder="Детальний опис завдання..."
              disabled={isSubmitting}
              {...register('description')}
            />
            {errors.description && (
              <span className="task-dialog__error">{errors.description.message}</span>
            )}
          </div>

          <div className="task-dialog__row">
            <div className="task-dialog__group">
              <label className="task-dialog__label" htmlFor="task-category">
                Категорія *
              </label>
              <input
                id="task-category"
                type="text"
                className={`task-dialog__input ${errors.category ? 'task-dialog__input--error' : ''}`}
                placeholder="Наприклад, React"
                disabled={isSubmitting}
                {...register('category')}
              />
              {errors.category && (
                <span className="task-dialog__error">{errors.category.message}</span>
              )}
            </div>

            <div className="task-dialog__group">
              <label className="task-dialog__label" htmlFor="task-priority">
                Пріоритет
              </label>
              <select
                id="task-priority"
                className="task-dialog__select"
                disabled={isSubmitting}
                {...register('priority')}
              >
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
              </select>
            </div>
          </div>

          <div className="task-dialog__actions">
            <button
              type="button"
              className="task-dialog__btn task-dialog__btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="task-dialog__btn task-dialog__btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Збереження...'
                : mode === 'edit'
                  ? 'Зберегти зміни'
                  : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};