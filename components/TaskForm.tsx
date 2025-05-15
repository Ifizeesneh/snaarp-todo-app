'use client';

import { useState } from 'react';
import { useAddTask } from '../hooks/useTasks';
import { useToast } from './ui/toasts';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const { mutate: addTask, isPending } = useAddTask();
  const { showToast } = useToast();
  
  const validateInput = (value: string): boolean => {
    if (!value.trim()) {
      setError('Task cannot be empty');
      showToast('Please enter a task', 'error');
      return false;
    }
    if (value.length > 100) {
      setError('Task cannot exceed 100 characters');
      showToast('Task is too long (max 100 chars)', 'error');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateInput(title)) return;
    
    addTask(title, {
      onSuccess: () => {
        showToast('Task added successfully', 'success');
        setTitle('');
      },
      onError: () => {
        showToast('Failed to add task', 'error');
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    // Clear error when user starts typing
    if (error && value.trim()) setError('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col">
        <div className="flex">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={handleChange}
            className={`flex-grow px-4 py-2 mr-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
              error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isPending}
            maxLength={100}
            aria-describedby="task-error"
            aria-invalid={!!error}
          />
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 flex items-center justify-center min-w-20 transition-all duration-200 ${
              isPending || !title.trim()
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 hover:shadow-md cursor-pointer'
            }`}
            disabled={isPending || !title.trim()}
            aria-busy={isPending}
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
        {error && (
          <p id="task-error" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </form>
  );
};

export default TaskForm;