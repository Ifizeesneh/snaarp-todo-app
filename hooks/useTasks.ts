'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskFilter } from '../types';
import { getTasks, addTask, updateTask, deleteTask, saveTasks } from '../lib/storage';

const TASKS_QUERY_KEY = 'tasks';

export const useTasks = (filter: TaskFilter = 'all') => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, filter],
    queryFn: () => {
      const tasks = getTasks();
      
      switch (filter) {
        case 'active':
          return tasks.filter(task => !task.completed);
        case 'completed':
          return tasks.filter(task => task.completed);
        default:
          return tasks;
      }
    },
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (title: string) => {
      try {
        return Promise.resolve(addTask(title));
      } catch (error) {
        return Promise.reject(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      try {
        return Promise.resolve(updateTask(taskId, updates));
      } catch (error) {
        return Promise.reject(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: string) => {
      try {
        return Promise.resolve(deleteTask(taskId));
      } catch (error) {
        return Promise.reject(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

export const useClearCompletedTasks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      try {
        const tasks = getTasks();
        const activeTasks = tasks.filter(task => !task.completed);
        saveTasks(activeTasks);
        return Promise.resolve(activeTasks);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};