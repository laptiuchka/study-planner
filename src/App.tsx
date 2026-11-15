import React, { useState, useEffect } from 'react';
import type { Task } from './types/task';
import { TaskProvider } from './context/TaskContext';
import { useTaskContext } from './hooks/useTaskContext';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Pagination } from './components/Pagination';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { Toast } from './components/Toast';
import './App.scss';

const MainContent: React.FC = () => {
  const {
    tasks,
    currentPage,
    totalPages,
    isLoading,
    selectedTaskId,
    fetchTasks,
    selectTask,
  } = useTaskContext();

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const activeCount = tasks.filter((t) => !t.completed).length;
    document.title = `Study Planner — ${activeCount} active tasks`;
  }, [tasks]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="main-content">
      <TaskForm
        editingTask={editingTask}
        onCancelEdit={() => setEditingTask(null)}
      />
      <TaskFilters />
      <TaskStats />
      <TaskList onEditTask={handleEditTask} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => fetchTasks(page)}
        disabled={isLoading}
      />
      <TaskDetailsModal
        taskId={selectedTaskId}
        onClose={() => selectTask(null)}
      />
      <Toast />
    </main>
  );
};

export function App() {
  return (
    <TaskProvider>
      <div className="app-container">
        <Header />
        <MainContent />
      </div>
    </TaskProvider>
  );
}

export default App;