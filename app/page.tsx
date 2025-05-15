'use client';

import { useState, useEffect } from 'react';
import { TaskFilter as FilterType } from '../types';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskFilter from '../components/TaskFilter';
import TaskStats from '../components/TaskStats';

export default function Home() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div
        className={`container max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg transition-all duration-500 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
          }`}
      >
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Todo App
          </span>
        </h1>

        <TaskForm />

        <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

        <TaskList filter={filter} />

        <TaskStats />
      </div>
    </main>
  );
}