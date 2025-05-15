import { Task } from '../types';

const STORAGE_KEY = 'todo-tasks';

export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  const storedTasks = localStorage.getItem(STORAGE_KEY);
  return storedTasks ? JSON.parse(storedTasks) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (title: string): Task => {
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    completed: false,
  };
  
  const tasks = getTasks();
  saveTasks([...tasks, newTask]);
  return newTask;
};

export const updateTask = (taskId: string, updates: Partial<Task>): Task | null => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = { ...tasks[taskIndex], ...updates };
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  
  return updatedTask;
};

export const deleteTask = (taskId: string): boolean => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length === tasks.length) return false;
  
  saveTasks(filteredTasks);
  return true;
};