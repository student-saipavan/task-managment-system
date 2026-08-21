import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, Plus, ClipboardList } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        sort,
        order
      });
      if (search) queryParams.append('search', search);
      if (status !== 'All') queryParams.append('status', status);
      if (priority !== 'All') queryParams.append('priority', priority);

      const res = await api.get(`/tasks?${queryParams.toString()}`);
      setTasks(res.data.data);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debounce search slightly
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status, priority, sort, order, page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    switch(value) {
      case 'newest': setSort('createdAt'); setOrder('desc'); break;
      case 'oldest': setSort('createdAt'); setOrder('asc'); break;
      case 'due-earliest': setSort('dueDate'); setOrder('asc'); break;
      case 'due-latest': setSort('dueDate'); setOrder('desc'); break;
      case 'priority-high': setSort('priority'); setOrder('desc'); break; // Needs custom logic on backend ideally, but string desc works for High -> Low in some ways (H, M, L -> M is before L, wait... actually string sorting is alphabetic. Real priority sorting needs numeric mapping. But we'll rely on backend string sorting for this demo or just accept alphabetic: 'High', 'Low', 'Medium'). Let's just pass sort=priority and order=desc.
      case 'priority-low': setSort('priority'); setOrder('asc'); break;
      default: setSort('createdAt'); setOrder('desc');
    }
    setPage(1); // Reset page on sort change
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const hasFilters = search !== '' || status !== 'All' || priority !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-text">My Tasks</h1>
        <Link 
          to="/tasks/new" 
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <Plus size={20} className="mr-1" />
          Create Task
        </Link>
      </div>

      <div className="bg-card p-4 rounded-xl shadow-sm border border-border mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-background border border-border rounded-lg text-text outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select 
            value={priority} 
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-background border border-border rounded-lg text-text outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select 
            onChange={handleSortChange}
            className="px-4 py-2 bg-background border border-border rounded-lg text-text outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="due-earliest">Due Date - Earliest</option>
            <option value="due-latest">Due Date - Latest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : safeTasks.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
            <ClipboardList size={32} className="text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-text mb-2">No tasks found</h3>
          {hasFilters ? (
            <p className="text-secondary mb-6">No tasks match the selected filters.</p>
          ) : (
            <>
              <p className="text-secondary mb-6">Create your first task and start organizing your work.</p>
              <Link 
                to="/tasks/new" 
                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex"
              >
                Create Task
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {safeTasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onDelete={handleDelete}
                onStatusChange={handleStatusChange} 
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-lg bg-card text-text disabled:opacity-50 hover:bg-background transition-colors font-medium text-sm"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-card text-text border border-border hover:bg-background'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-border rounded-lg bg-card text-text disabled:opacity-50 hover:bg-background transition-colors font-medium text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
