import type { Task } from '../types/task';

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'React Components',
    description: 'Опрацювати базові принципи компонентів React',
    completed: false,
    priority: 'high',
    category: 'React',
    createdBy: 'emilys',
    createdAt: '2026-11-16T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'TypeScript Exercises',
    description: 'Виконати практичні вправи з інтерфейсів та типів',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
    createdBy: 'emilys',
    createdAt: '2026-11-16T11:30:00.000Z',
  },
  {
    id: 3,
    title: 'CSS Modules / BEM',
    description: 'Налаштувати стилізацію для списку завдань',
    completed: false,
    priority: 'low',
    category: 'CSS',
    createdBy: 'emilys',
    createdAt: '2026-11-16T14:00:00.000Z',
  },
];