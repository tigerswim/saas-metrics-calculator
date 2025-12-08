'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface ChurnComparisonProps {
  logoChurnRate: number; // % of customers churned
  revenueChurnRate: number; // % of ARR churned (calculated from churned ARR / beginning ARR)
  customersChurned: number;
  totalCustomers: number;
  churnedARR: number;
  beginningARR: number;
}

export default function ChurnComparison({
  logoChurnRate,
  revenueChurnRate,
  customersChurned,
  totalCustomers,
  churnedARR,
  beginningARR,
}: ChurnComparisonProps) {
  const data = [
    {
      name: 'Logo Churn',
      value: logoChurnRate,
      color: '#ef4444',
      icon: 'users',
    },
    {
      name: 'Revenue Churn',
      value: revenueChurnRate,
      color: '#f97316',
      icon: 'currency',
    },
  ];

  const getChurnHealth = () => {
    if (logoChurnRate < 1.5 && revenueChurnRate < 2) return { status: 'Excellent', color: 'text-green-600' };
    if (logoChurnRate < 2.5 && revenueChurnRate < 3.5) return { status: 'Good', color: 'text-yellow-600' };
    return { status: 'Needs Attention', color: 'text-red-600' };
  };

  const health = getChurnHealth();
  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(1)}M`;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Churn Analysis</h3>
      <p className="text-sm text-slate-600 mb-6">Logo vs Revenue churn comparison</p>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, Math.max(5, Math.ceil(Math.max(logoChurnRate, revenueChurnRate)))]}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip
            formatter={(value: number) => `${value.toFixed(2)}%`}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserGroupIcon className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Logo Churn</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mb-1">{logoChurnRate.toFixed(2)}%</div>
          <div className="text-xs text-red-700">
            {customersChurned} of {totalCustomers} customers
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CurrencyDollarIcon className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Revenue Churn</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 mb-1">{revenueChurnRate.toFixed(2)}%</div>
          <div className="text-xs text-orange-700">
            {formatCurrency(churnedARR)} of {formatCurrency(beginningARR * 1000)}
          </div>
        </div>
      </div>

      {/* Health Indicator */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-sm text-slate-600">Churn Health:</span>
        <span className={`text-sm font-semibold ${health.color}`}>{health.status}</span>
      </div>

      {/* Targets */}
      <div className="mt-3 text-xs text-slate-500">
        <div>Target: Logo &lt;1.5%/month, Revenue &lt;2%/month</div>
      </div>
    </div>
  );
}
