import React, { memo } from 'react';

const StatsGrid = memo(({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {stats.map((stat, index) => (
      <div key={index} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <stat.icon className={`w-6 h-6 ${stat.color}`} aria-hidden="true" />
          <span className={`text-xs ${stat.change.includes('+') ? 'text-white' : 'text-neutral-300'}`}>
            {stat.change}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{stat.value}</h3>
        <p className="text-neutral-300 text-xs">{stat.title}</p>
      </div>
    ))}
  </div>
));

export default StatsGrid;