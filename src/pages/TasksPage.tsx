import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';
import { useTaskContext } from '../hooks/useTaskContext';
import { useAuth } from '../hooks/useAuth';
import { TaskFilters } from '../components/TaskFilters';
import { TaskStats } from '../components/TaskStats';
import { TaskList } from '../components/TaskList';
import { Pagination } from '../components/Pagination';
import { TaskFormDialog } from '../components/TaskFormDialog';
import './TasksPage.scss';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    currentPage,
    totalPages,
    isLoading,
    fetchTasks,
    addTask,
    updateTask,
    showToast,
  } = useTaskContext();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    const activeCount = tasks.filter((t) => !t.completed).length;
    document.title = `Study Planner — ${activeCount} active tasks`;
  }, [tasks]);

  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      showToast('Авторизуйтесь, щоб створити нове завдання', 'warning');
      navigate('/login', { state: { from: location } });
      return;
    }
    setDialogMode('create');
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    if (!isAuthenticated) {
      showToast('Авторизуйтесь, щоб редагувати завдання', 'warning');
      navigate('/login', { state: { from: location } });
      return;
    }
    setDialogMode('edit');
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDialogSubmit = async (data: TaskFormData) => {
    if (dialogMode === 'edit' && editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await addTask({
        ...data,
        createdBy: user?.username || 'current_user',
      });
    }
  };

  return (
    <section className="tasks-page">
      <div className="tasks-page__toolbar">
        <div>
          <h2 className="tasks-page__heading">Список завдань</h2>
          <p className="tasks-page__hint">
            {isAuthenticated
              ? `Ви увійшли як ${user?.username}. Доступні створення, редагування та видалення.`
              : 'Гостьовий режим: перегляд відкритий, для CRUD-дій потрібна авторизація.'}
          </p>
        </div>

        <button
          type="button"
          className="tasks-page__add-btn"
          onClick={handleOpenCreate}
          title="Створити нове завдання"
        >
          + Нове завдання
        </button>
      </div>

      <TaskFilters />
      <TaskStats />
      <TaskList onEditTask={handleOpenEdit} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => fetchTasks(page)}
        disabled={isLoading}
      />

      <TaskFormDialog
        open={dialogOpen}
        mode={dialogMode}
        task={editingTask}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </section>
  );
};