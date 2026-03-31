import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { EmptyState } from '../common/EmptyState';

/**
 * mode: 'line' | 'multi' | 'area'
 * data: array of objects keyed by nameKey + dataKey (or multiple line keys)
 * lines: for multi-mode, Array<{ key, name, color }>
 */
export function ResponseTimeChart({
  data = [],
  mode = 'line',
  lines = [],
  dataKey = 'avgMinutes',
  nameKey = 'date',
  color = '#e8622a',
  height = 220,
}) {
  if (!data.length) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <EmptyState title="No data yet" description="Response time data will appear here." />
      </div>
    );
  }

  const commonProps = {
    data,
    margin: { top: 4, right: 8, bottom: 4, left: -16 },
  };

  const axisProps = {
    XAxis: { dataKey: nameKey, tick: { fontSize: 11, fill: '#6b6860' }, axisLine: { stroke: '#3a3a36' }, tickLine: false },
    YAxis: { tick: { fontSize: 11, fill: '#6b6860' }, axisLine: { stroke: '#3a3a36' }, tickLine: false, unit: ' min', allowDecimals: false },
    CartesianGrid: { strokeDasharray: '3 3', vertical: false, stroke: '#3a3a36' },
    Tooltip: { contentStyle: { background: '#333330', border: '1px solid #4a4a45', borderRadius: '6px', color: '#f0ede6' } },
  };

  if (mode === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...commonProps}>
          <CartesianGrid {...axisProps.CartesianGrid} />
          <XAxis {...axisProps.XAxis} />
          <YAxis {...axisProps.YAxis} />
          <Tooltip {...axisProps.Tooltip} />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}1A`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...commonProps}>
        <CartesianGrid {...axisProps.CartesianGrid} />
        <XAxis {...axisProps.XAxis} />
        <YAxis {...axisProps.YAxis} />
        <Tooltip {...axisProps.Tooltip} />
        {mode === 'multi' && lines.length > 0 ? (
          <>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} formatter={(value) => <span style={{ color: '#6b6860' }}>{value}</span>} />
            {lines.map((l) => (
              <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} />
            ))}
          </>
        ) : (
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
