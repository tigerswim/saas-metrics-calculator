'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ARRWaterfallProps {
  beginningARR: number; // in K
  newBookings: number; // in K
  expansion: number; // in K
  churn: number; // in K
  endingARR: number; // in K
}

export default function ARRWaterfall({ beginningARR, newBookings, expansion, churn, endingARR }: ARRWaterfallProps) {
  const data = [
    { name: 'Beginning ARR', value: beginningARR, color: '#94a3b8' },
    { name: 'New Bookings', value: newBookings, color: '#22c55e' },
    { name: 'Expansion', value: expansion, color: '#3b82f6' },
    { name: 'Churn', value: -churn, color: '#ef4444' },
    { name: 'Ending ARR', value: endingARR, color: '#9333ea' },
  ];

  const formatValue = (value: number) => {
    return `$${(value / 1000).toFixed(1)}M`;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">ARR Waterfall</h3>
      <p className="text-sm text-slate-600 mb-4">Visualizing how ARR changes from beginning to end of month</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}M`}
          />
          <Tooltip
            formatter={(value: number | undefined) => value !== undefined ? formatValue(Math.abs(value)) : ''}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
