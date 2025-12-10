'use client';

import { CalculatedMetrics, Inputs } from '../types';
import ARRWaterfall from './ARRWaterfall';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';

interface GrowthHealthProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

export default function GrowthHealth({ metrics, inputs }: GrowthHealthProps) {
  // Status calculations
  const grrStatus = metrics.annualizedGRR >= 90 ? 'good' : metrics.annualizedGRR >= 80 ? 'warning' : 'bad';
  const nrrStatus = metrics.annualizedNRR >= 110 ? 'good' : metrics.annualizedNRR >= 100 ? 'warning' : 'bad';
  const logoChurnStatus = metrics.logoChurnRate <= 1.5 ? 'good' : metrics.logoChurnRate <= 3 ? 'warning' : 'bad';
  const quickRatioStatus = metrics.saasQuickRatio >= 4 ? 'good' : metrics.saasQuickRatio >= 2 ? 'warning' : 'bad';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'bad': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  // ARR Waterfall data
  const beginningARRK = inputs.beginningARR * 1000;
  const maxARR = Math.max(beginningARRK, metrics.endingARR * 1000);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Growth & Retention</h3>
            <p className="text-sm text-slate-500">Revenue and customer health metrics</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quickRatioStatus)}`}>
            Quick Ratio: {metrics.saasQuickRatio.toFixed(1)}x
          </div>
        </div>
      </div>

      {/* ARR Waterfall */}
      <div className="p-6 border-b border-slate-200">
        <ARRWaterfall
          beginningARR={inputs.beginningARR}
          newBookings={metrics.newBookings}
          expansion={inputs.expansionARR}
          churn={inputs.churnedARR}
          endingARR={metrics.endingARR}
        />
      </div>

      {/* Retention Metrics */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Retention Metrics (Annualized)</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* GRR */}
          <div className={`rounded-xl p-4 border ${grrStatus === 'good' ? 'border-green-200 bg-green-50' : grrStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">GRR</span>
              <ArrowsRightLeftIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{metrics.annualizedGRR.toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">Target: &gt;90%</div>
            <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${grrStatus === 'good' ? 'bg-green-500' : grrStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(metrics.annualizedGRR, 100)}%` }}
              />
            </div>
          </div>

          {/* NRR */}
          <div className={`rounded-xl p-4 border ${nrrStatus === 'good' ? 'border-green-200 bg-green-50' : nrrStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">NRR</span>
              <ArrowTrendingUpIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{metrics.annualizedNRR.toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">Target: &gt;110%</div>
            <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${nrrStatus === 'good' ? 'bg-green-500' : nrrStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min((metrics.annualizedNRR / 150) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <UserGroupIcon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900">{metrics.endingCustomerCount}</div>
            <div className="text-xs text-slate-500">Total Customers</div>
          </div>
          <div className={`rounded-lg p-3 text-center ${logoChurnStatus === 'good' ? 'bg-green-50' : logoChurnStatus === 'warning' ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <ArrowTrendingDownIcon className={`w-5 h-5 mx-auto mb-1 ${logoChurnStatus === 'good' ? 'text-green-500' : logoChurnStatus === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
            <div className="text-lg font-bold text-slate-900">{metrics.logoChurnRate.toFixed(1)}%</div>
            <div className="text-xs text-slate-500">Logo Churn</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900">+{inputs.newCustomersAdded}</div>
            <div className="text-xs text-slate-500">New Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
