import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { Calendar, Edit2, Trash2, CheckCircle } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };

  const priorityColors = {
    'Low': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    'Medium': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    'High': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
  };

  let isOverdue = false;
  if (task.dueDate && task.status !== 'Done') {
    const date = parseISO(task.dueDate);
    isOverdue = isPast(date) && !isToday(date);
  }

  return (
    <>
      <div className={`bg-card rounded-xl shadow-sm border ${isOverdue ? 'border-red-300 dark:border-red-800' : 'border-border'} p-5 transition-shadow hover:shadow-md`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-lg font-semibold ${task.status === 'Done' ? 'line-through text-secondary' : 'text-text'}`}>
            {task.title}
          </h3>
          <div className="flex space-x-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
          </div>
        </div>
        
        {task.description && (
          <p className="text-secondary text-sm mb-4 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center text-xs font-medium">
            <Calendar size={14} className="mr-1 text-secondary" />
            <span className={isOverdue ? 'text-red-500 font-bold' : 'text-secondary'}>
              {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No due date'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            {task.status !== 'Done' && (
              <button 
                onClick={() => onStatusChange(task._id, 'Done')}
                title="Mark as Done"
                className="p-1.5 text-secondary hover:text-green-500 rounded-md hover:bg-background transition-colors"
              >
                <CheckCircle size={18} />
              </button>
            )}
            <Link 
              to={`/tasks/${task._id}/edit`}
              className="p-1.5 text-secondary hover:text-primary rounded-md hover:bg-background transition-colors block"
            >
              <Edit2 size={18} />
            </Link>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 text-secondary hover:text-red-500 rounded-md hover:bg-background transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(task._id)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </>
  );
};

export default TaskCard;
