
'use client';

import { useTasks, useClearCompletedTasks } from '../hooks/useTasks';
import { useConfirm } from './ui/alert-dialog';
import { useToast } from './ui/toasts';


const TaskStats = () => {
  const { data: allTasks = [] } = useTasks('all');
  const { data: activeTasks = [] } = useTasks('active');
  const { data: completedTasks = [] } = useTasks('completed');
  const { mutate: clearCompleted, isPending } = useClearCompletedTasks();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  
  const handleClearCompleted = () => {
    if (completedTasks.length > 0) {
      confirm({
        title: 'Clear Completed Tasks',
        message: `Are you sure you want to delete all ${completedTasks.length} completed tasks?`,
        onConfirm: () => {
          clearCompleted(undefined, {
            onSuccess: () => {
              showToast('Completed tasks cleared successfully', 'success');
            }
          });
        },
        onCancel: () => {}
      });
    }
  };
  
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
      <div className="animate-fade-in">
        {activeTasks.length} item{activeTasks.length !== 1 ? 's' : ''} left
      </div>
      {completedTasks.length > 0 && (
        <button
          onClick={handleClearCompleted}
          disabled={isPending}
          className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center hover:underline transition-all duration-200"
        >
          {isPending ? (
            <svg className="w-4 h-4 mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          Clear completed
        </button>
      )}
    </div>
  );
};

export default TaskStats;