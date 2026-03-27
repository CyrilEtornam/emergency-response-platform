import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmptyState } from '../common/EmptyState';

const DEFAULT_COLORS = ['#1D4ED8', '#D97706', '#DC2626', '#16A34A', '#7C3AED', '#EA580C'];

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
          contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F1F5F9' }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11 }}
          formatter={(value) => <span style={{ color: '#94A3B8' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
