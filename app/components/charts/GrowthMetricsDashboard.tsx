'use client';

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, BoltIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

interface GrowthMetricsDashboardProps {
  netNewARR: number;
  growthRate: number;
  beginningARR: number;
  endingARR: number;
  newBookings: number;
  expansion: number;
  churn: number;
}

export default function GrowthMetricsDashboard({
  netNewARR,
  growthRate,
  beginningARR,
  endingARR,
  newBookings,
  expansion,
  churn,
}: GrowthMetricsDashboardProps) {
  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(1)}M`;
  const isPositiveGrowth = growthRate > 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Growth Metrics</h3>
      <p className="text-sm text-slate-600 mb-6">Monthly ARR momentum and composition</p>

      {/* Main Metric */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">Net New ARR</span>
          {isPositiveGrowth ? (
            <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
          ) : (
            <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
          )}
        </div>
        <div className="text-4xl font-bold text-blue-900 mb-1">
          {formatCurrency(netNewARR)}
        </div>
        <div className={`text-sm font-semibold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
          {isPositiveGrowth ? '+' : ''}{growthRate.toFixed(2)}% Growth
        </div>
      </div>

      {/* Component Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* New Bookings */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BoltIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-sm text-green-900 font-medium mb-1">New</div>
          <div className="text-xl font-bold text-green-900">{formatCurrency(newBookings)}</div>
        </div>

        {/* Expansion */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-sm text-blue-900 font-medium mb-1">Expansion</div>
          <div className="text-xl font-bold text-blue-900">{formatCurrency(expansion)}</div>
        </div>

        {/* Churn */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-sm text-red-900 font-medium mb-1">Churn</div>
          <div className="text-xl font-bold text-red-900">-{formatCurrency(churn)}</div>
        </div>
      </div>

      {/* ARR Summary */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
        <div>
          <div className="text-xs text-slate-500">Beginning ARR</div>
          <div className="text-sm font-semibold text-slate-900">{formatCurrency(beginningARR * 1000)}</div>
        </div>
        <CurrencyDollarIcon className="w-5 h-5 text-slate-400" />
        <div>
          <div className="text-xs text-slate-500">Ending ARR</div>
          <div className="text-sm font-semibold text-slate-900">{formatCurrency(endingARR)}</div>
        </div>
      </div>
    </div>
  );
}
