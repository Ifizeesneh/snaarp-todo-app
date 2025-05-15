'use client';

import { TaskFilter as FilterType } from '../types';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const TaskFilter = ({ currentFilter, onFilterChange }: TaskFilterProps) => {
  const filters: FilterType[] = ['all', 'active', 'completed'];
  
  return (
    <div className="flex justify-center mb-6 space-x-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-3 py-1 text-sm rounded-md transition-all duration-200 transform ${
            currentFilter === filter
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;