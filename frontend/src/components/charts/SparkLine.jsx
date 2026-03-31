import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export function SparkLine({ data = [], dataKey = 'value', color = '#e8622a', height = 40 }) {
  if (!data.length) return <div style={{ height }} className="flex items-center justify-center text-[13px] text-muted">No data</div>;

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
          contentStyle={{ fontSize: 11, padding: '2px 6px', background: '#333330', border: '1px solid #4a4a45', borderRadius: 4, color: '#f0ede6' }}
          itemStyle={{ color: '#f0ede6' }}
          labelFormatter={() => ''}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
