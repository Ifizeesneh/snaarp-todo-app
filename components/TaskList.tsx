'use client';

import { Task, TaskFilter } from '../types';
import TaskItem from './TaskItem';
import { useTasks } from '../hooks/useTasks';
import { useEffect, useState } from 'react';

interface TaskListProps {
  filter: TaskFilter;
}

const TaskList = ({ filter }: TaskListProps) => {
  const { data: tasks = [], isLoading, isError } = useTasks(filter);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <svg className="w-8 h-8 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  if (isError) {
    return <div className="flex justify-center py-6 text-red-600 animate-shake">Error loading tasks</div>;
  }
  
  if (tasks.length === 0) {
    return (
      <div className="flex justify-center py-6 text-gray-500 animate-fade-in">
        {filter === 'all' 
          ? 'No tasks added yet' 
          : filter === 'active' 
            ? 'No active tasks' 
            : 'No completed tasks'}
      </div>
    );
  }
  
  return (
    <ul className="mt-4">
      {tasks.map((task, index) => (
        <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
          <TaskItem task={task} />
        </div>
      ))}
    </ul>
  );
};

export default TaskList;