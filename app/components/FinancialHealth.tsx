'use client';

import { CalculatedMetrics } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface FinancialHealthProps {
  metrics: CalculatedMetrics;
}

export default function FinancialHealth({ metrics }: FinancialHealthProps) {
  // Status calculations
  const ruleOf40Status = metrics.ruleOf40 >= 40 ? 'good' : metrics.ruleOf40 >= 25 ? 'warning' : 'bad';
  const grossMarginStatus = metrics.grossMargin >= 75 ? 'good' : metrics.grossMargin >= 65 ? 'warning' : 'bad';
  const burnMultipleStatus = metrics.burnMultiple <= 1.5 ? 'good' : metrics.burnMultiple <= 2.5 ? 'warning' : 'bad';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'bad': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'bad':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Rule of 40 gauge position
  const gaugePosition = Math.min(Math.max(metrics.ruleOf40, 0), 80);
  const targetPosition = 40; // 40% mark

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Financial Health</h3>
            <p className="text-sm text-slate-500">Profitability and efficiency metrics</p>
          </div>
        </div>
      </div>

      {/* Rule of 40 Gauge */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-700">Rule of 40</h4>
          <div className={`flex items-center gap-2 ${getStatusColor(ruleOf40Status)}`}>
            {getStatusIcon(ruleOf40Status)}
            <span className="text-2xl font-bold">{metrics.ruleOf40.toFixed(1)}%</span>
          </div>
        </div>

        {/* Gauge */}
        <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden">
          {/* Background gradient zones */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 bg-gradient-to-r from-red-200 to-yellow-200" />
            <div className="w-1/2 bg-gradient-to-r from-yellow-200 to-green-200" />
          </div>

          {/* Target line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10"
            style={{ left: `${targetPosition}%` }}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-600">
              40%
            </div>
          </div>

          {/* Current value indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-slate-800 shadow-md z-20 flex items-center justify-center transition-all duration-500"
            style={{ left: `calc(${(gaugePosition / 80) * 100}% - 12px)` }}
          >
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium mb-1">Growth Rate</div>
            <div className="text-xl font-bold text-blue-900">
              {metrics.annualizedGrowthRate.toFixed(1)}%
            </div>
          </div>
          <div className={`rounded-lg p-3 ${metrics.ebitdaMargin >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-xs font-medium mb-1 ${metrics.ebitdaMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              EBITDA Margin
            </div>
            <div className={`text-xl font-bold ${metrics.ebitdaMargin >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {metrics.ebitdaMargin.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Gross Margin */}
          <div className={`rounded-xl p-4 border ${grossMarginStatus === 'good' ? 'border-green-200 bg-green-50' : grossMarginStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">Gross Margin</span>
              {getStatusIcon(grossMarginStatus)}
            </div>
            <div className="text-2xl font-bold text-slate-900">{metrics.grossMargin.toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">Target: &gt;75%</div>
          </div>

          {/* Burn Multiple */}
          <div className={`rounded-xl p-4 border ${burnMultipleStatus === 'good' ? 'border-green-200 bg-green-50' : burnMultipleStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">Burn Multiple</span>
              {getStatusIcon(burnMultipleStatus)}
            </div>
            <div className="text-2xl font-bold text-slate-900">{metrics.burnMultiple.toFixed(1)}x</div>
            <div className="text-xs text-slate-500 mt-1">Target: &lt;1.5x</div>
          </div>
        </div>

        {/* P&L Summary */}
        <div className="mt-4 bg-slate-50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Monthly P&L Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">MRR</span>
              <span className="font-semibold text-slate-900">
                ${Math.round(metrics.mrr * 1000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Gross Profit</span>
              <span className="font-semibold text-green-600">
                ${Math.round(metrics.grossProfit).toLocaleString()}K
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total OpEx</span>
              <span className="font-semibold text-red-600">
                -${Math.round(metrics.totalOpEx).toLocaleString()}K
              </span>
            </div>
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-700">EBITDA</span>
              <span className={metrics.ebitda >= 0 ? 'text-green-600' : 'text-red-600'}>
                {metrics.ebitda >= 0 ? '' : '-'}${Math.abs(Math.round(metrics.ebitda)).toLocaleString()}K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
