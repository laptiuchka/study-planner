import { type Task, type TaskAction } from '../types/task';

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: Date.now(),
        completed: false,
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