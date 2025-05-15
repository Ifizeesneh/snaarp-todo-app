'use client';

import { useState } from 'react';
import { useAddTask } from '../hooks/useTasks';
import { useToast } from './ui/toasts';


const TaskForm = () => {
  const [title, setTitle] = useState('');
  const { mutate: addTask, isPending } = useAddTask();
  const { showToast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addTask(title, {
      onSuccess: () => {
        showToast('Task added successfully', 'success');
        setTitle('');
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow px-4 py-2 mr-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          disabled={isPending}
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center min-w-20 transition-all duration-200 hover:shadow-md"
          disabled={isPending || !title.trim()}
        >
          {isPending ? (
            <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Add"
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;