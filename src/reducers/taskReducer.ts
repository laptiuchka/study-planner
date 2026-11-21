import type { Task, Priority } from '../types/task';

export type TaskAction =
  | {
      type: 'ADD_TASK';
      payload: {
        title: string;
        description: string;
        category: string;
        priority: Priority;
        createdBy?: string;
      };
    }
  | { type: 'TOGGLE_TASK'; payload: number }
  | { type: 'UPDATE_TASK'; payload: { id: number; data: Partial<Omit<Task, 'id'>> } }
  | { type: 'REQUEST_DELETE'; payload: number }
  | { type: 'CONFIRM_DELETE'; payload: number }
  | { type: 'UNDO_DELETE'; payload: number }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'RESET_TASKS'; payload: Task[] };

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: Date.now(),
        completed: false,
        createdBy: action.payload.createdBy || 'emilys',
        createdAt: new Date().toISOString(),
        isPendingDelete: false,
      };
      return [...state, newTask];
    }

    case 'TOGGLE_TASK':
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );

    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.data }
          : task
      );

    case 'REQUEST_DELETE':
      return state.map((task) =>
        task.id === action.payload ? { ...task, isPendingDelete: true } : task
      );

    case 'CONFIRM_DELETE':
      return state.filter((task) => task.id !== action.payload);

    case 'UNDO_DELETE':
      return state.map((task) =>
        task.id === action.payload ? { ...task, isPendingDelete: false } : task
      );

    case 'CLEAR_COMPLETED':
      return state.filter((task) => !task.completed);

    case 'RESET_TASKS':
      return action.payload;

    default:
      return state;
  }
}