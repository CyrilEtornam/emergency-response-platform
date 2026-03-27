import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { EmptyState } from '../common/EmptyState';

const DEFAULT_COLORS = {
  CRITICAL: '#DC2626',
  HIGH: '#EA580C',
  MEDIUM: '#D97706',
  LOW: '#16A34A',
};

/**
 * Renders a bar chart for incidents.
 * mode: 'severity' → stacked bars by severity label
 *       'agency' → grouped bars with 3 bars per day (uses `bars` prop)
 *       'default' → single bar per entry
 */
export function IncidentBarChart({
  data = [],
  mode = 'default',
  bars = [],
  dataKey = 'count',
  nameKey = 'label',
  color = '#1D4ED8',
  height = 220,
}) {
  if (!data.length) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <EmptyState title="No data yet" description="Data will appear as incidents are recorded." />
      </div>
    );
  }

  const isSeverity = mode === 'severity';
  const isGrouped = mode === 'agency' && bars.length > 0;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
        <XAxis
          dataKey={nameKey}
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '6px', color: '#F1F5F9' }}
          cursor={{ fill: '#263147' }}
        />
        {isGrouped ? (
          <>
            <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 11 }} formatter={(value) => <span style={{ color: '#94A3B8' }}>{value}</span>} />
            {bars.map((b) => (
              <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[2, 2, 0, 0]} maxBarSize={20} />
            ))}
          </>
        ) : isSeverity ? (
          <Bar dataKey={dataKey} radius={[2, 2, 0, 0]} maxBarSize={32}>
            {data.map((entry, i) => (
              <Cell key={i} fill={DEFAULT_COLORS[entry[nameKey]] || color} />
            ))}
          </Bar>
        ) : (
          <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} maxBarSize={32} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
