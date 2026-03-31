import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmptyState } from '../common/EmptyState';

const DEFAULT_COLORS = ['#4a9ee8', '#e8a82a', '#e84242', '#4caf6e', '#e8622a', '#6b6860'];

/**
 * Donut/Pie chart for status or type breakdown.
 * data: Array<{ name: string, value: number }>
 * colors: optional Array<string>
 */
export function AgencyPieChart({ data = [], colors = DEFAULT_COLORS, height = 220, innerRadius = 50 }) {
  const filtered = data.filter((d) => d.value > 0);

  if (!filtered.length) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <EmptyState title="No data yet" description="Breakdown will appear as incidents are recorded." />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + 40}
          paddingAngle={2}
          dataKey="value"
        >
          {filtered.map((entry, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#333330', border: '1px solid #4a4a45', borderRadius: '6px', color: '#f0ede6' }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11 }}
          formatter={(value) => <span style={{ color: '#6b6860' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
