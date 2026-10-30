import { useState } from 'react';
import { type FilterStatus, type Task } from './types/task';
import { initialTasks } from './data/initialTasks';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import './App.css';

export function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sortOrder, setSortOrder] = useState<'none' | 'desc' | 'asc'>('none');

  const handleAddTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...newTaskData, id: Date.now() };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

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

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <TaskForm onAddTask={handleAddTask} />
        <TaskStats tasks={tasks} />
        <TaskFilters 
          currentFilter={filter} 
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
        <TaskList
          tasks={filteredTasks}
          totalTasksCount={tasks.length}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>
    </div>
  );
}

export default App;