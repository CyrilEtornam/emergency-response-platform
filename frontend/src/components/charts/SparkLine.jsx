import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export function SparkLine({ data = [], dataKey = 'value', color = '#1D4ED8', height = 40 }) {
  if (!data.length) return <div style={{ height }} className="flex items-center justify-center text-xs text-[#6B7280]">No data</div>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip
          contentStyle={{ fontSize: 11, padding: '2px 6px', background: '#1E293B', border: '1px solid #334155', borderRadius: 4, color: '#F1F5F9' }}
          itemStyle={{ color: '#F1F5F9' }}
          labelFormatter={() => ''}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
