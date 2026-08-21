import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TaskChart = ({ data }) => {
  const chartData = [
    { name: 'Todo', value: data.todoTasks || 0, color: '#3b82f6' },
    { name: 'In Progress', value: data.inProgressTasks || 0, color: '#f59e0b' },
    { name: 'Done', value: data.completedTasks || 0, color: '#10b981' }
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-secondary">No data to display</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
            itemStyle={{ color: 'var(--text)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskChart;
