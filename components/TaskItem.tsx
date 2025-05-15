'use client';

import { useState } from 'react';
import { Task } from '../types';
import { useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useToast } from './ui/toasts';
import { useConfirm } from './ui/alert-dialog';


interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  
  const handleToggleComplete = () => {
    updateTask(
      {
        taskId: task.id,
        updates: { completed: !task.completed }
      },
      {
        onSuccess: () => {
          showToast(`Task ${task.completed ? 'marked as active' : 'marked as completed'}`, 'success');
        }
      }
    );
  };
  
  const handleDelete = () => {
    confirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"?`,
      onConfirm: () => {
        deleteTask(task.id, {
          onSuccess: () => {
            showToast('Task deleted successfully', 'success');
          }
        });
      },
      onCancel: () => {}
    });
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(task.title);
  };
  
  const handleSaveEdit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTask(
        {
          taskId: task.id,
          updates: { title: editedTitle }
        },
        {
          onSuccess: () => {
            showToast('Task updated successfully', 'success');
          }
        }
      );
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
  };
  
  return (
    <li className="flex items-center justify-between py-3 border-b hover:bg-gray-50 transition-colors duration-200 group">
      {isEditing ? (
        <div className="flex flex-grow mr-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-grow px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex items-center ml-2">
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating || !editedTitle.trim()}
              className="px-2 py-1 text-sm text-green-600 hover:text-green-800 focus:outline-none"
            >
              {isUpdating ? (
                <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <div className="checkbox-container relative">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                className="absolute opacity-0 w-0 h-0"
                disabled={isUpdating}
                id={`checkbox-${task.id}`}
              />
              <label 
                htmlFor={`checkbox-${task.id}`}
                className="checkbox-custom relative flex items-center cursor-pointer"
              >
                <span className={`w-4 h-4 mr-3 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                  task.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                }`}>
                  {task.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.293-5.293a1 1 0 011.414 0l4-4a1 1 0 00-1.414-1.414L9.707 11.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </label>
            </div>
            <span 
              className={`text-gray-800 transition-all duration-200 ${task.completed ? 'line-through text-gray-400' : ''}`}
            >
              {task.title}
            </span>
          </div>
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEdit}
              className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800 focus:outline-none transition-transform duration-200 hover:scale-110"
              aria-label="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-2 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none transition-transform duration-200 hover:scale-110"
              aria-label="Delete task"
            >
              {isDeleting ? (
                <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TaskItem;