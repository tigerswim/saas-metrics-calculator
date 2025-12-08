'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface RetentionComparisonProps {
  grr: number;
  nrr: number;
  annualizedGRR: number;
  annualizedNRR: number;
}

export default function RetentionComparison({ grr, nrr, annualizedGRR, annualizedNRR }: RetentionComparisonProps) {
  const data = [
    {
      name: 'Monthly',
      GRR: grr,
      NRR: nrr,
    },
    {
      name: 'Annualized',
      GRR: annualizedGRR,
      NRR: annualizedNRR,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Retention Comparison</h3>
      <p className="text-sm text-slate-600 mb-4">GRR vs NRR shows if you're growing within existing customers</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, Math.max(120, Math.ceil(Math.max(nrr, annualizedNRR) / 10) * 10)]}
          />
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          <ReferenceLine y={100} stroke="#64748b" strokeDasharray="3 3" label={{ value: '100%', position: 'right', fontSize: 12 }} />
          <Bar dataKey="GRR" fill="#9333ea" radius={[8, 8, 0, 0]} />
          <Bar dataKey="NRR" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-600 rounded"></div>
          <span>GRR: Revenue retained (excluding expansion)</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>NRR: Revenue retained + expansion (&gt;100% = growth from existing customers)</span>
        </div>
      </div>
    </div>
  );
}
