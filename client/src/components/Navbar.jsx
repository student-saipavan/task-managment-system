import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, LogOut, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center text-primary font-bold text-xl gap-2">
              <CheckSquare size={24} />
              <span>TaskFlow</span>
            </Link>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-transparent text-text hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/tasks" className="border-transparent text-text hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Tasks
                </Link>
                <Link to="/tasks/new" className="border-transparent text-text hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Add Task
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-secondary hover:text-primary hover:bg-background transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-text hidden sm:block">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-primary text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile nav (simplified) */}
      {user && (
        <div className="sm:hidden border-t border-border flex justify-around py-2 bg-card">
          <Link to="/dashboard" className="text-text hover:text-primary text-sm font-medium">Dashboard</Link>
          <Link to="/tasks" className="text-text hover:text-primary text-sm font-medium">Tasks</Link>
          <Link to="/tasks/new" className="text-text hover:text-primary text-sm font-medium">Add</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
