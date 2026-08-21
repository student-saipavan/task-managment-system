import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskChart from '../components/TaskChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { ClipboardList, CheckCircle2, Clock, Activity } from 'lucide-react';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/tasks/analytics/summary');
        setAnalytics(res.data);
      } catch (error) {
        console.error('Error fetching analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <div className="p-8 text-center text-red-500">Failed to load analytics.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-text mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tasks" value={analytics.totalTasks} icon={<ClipboardList className="text-primary" size={24} />} />
        <StatCard title="Completed Tasks" value={analytics.completedTasks} icon={<CheckCircle2 className="text-green-500" size={24} />} />
        <StatCard title="Pending Tasks" value={analytics.pendingTasks} icon={<Clock className="text-yellow-500" size={24} />} />
        <StatCard title="Completion %" value={`${analytics.completionPercentage}%`} icon={<Activity className="text-purple-500" size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-text mb-4">Task Status Distribution</h2>
          <TaskChart data={analytics} />
        </div>
        
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-text mb-4">Priority Breakdown</h2>
          <div className="space-y-4 mt-8">
            <PriorityBar label="High Priority" count={analytics.priorityStats?.high || 0} total={analytics.totalTasks} color="bg-red-500" />
            <PriorityBar label="Medium Priority" count={analytics.priorityStats?.medium || 0} total={analytics.totalTasks} color="bg-yellow-500" />
            <PriorityBar label="Low Priority" count={analytics.priorityStats?.low || 0} total={analytics.totalTasks} color="bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-card p-6 rounded-xl shadow-sm border border-border flex items-center">
    <div className="p-3 rounded-full bg-background mr-4">{icon}</div>
    <div>
      <p className="text-sm font-medium text-secondary">{title}</p>
      <p className="text-2xl font-bold text-text">{value}</p>
    </div>
  </div>
);

const PriorityBar = ({ label, count, total, color }) => {
  const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1 text-text">
        <span>{label}</span>
        <span className="font-medium">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-background rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default Dashboard;
