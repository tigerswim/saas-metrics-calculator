'use client';

import { CalculatedMetrics, Inputs } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface UnitEconomicsProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

interface MetricCardProps {
  label: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'bad';
  description?: string;
  large?: boolean;
}

function MetricCard({ label, value, target, status, description, large = false }: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'bad':
        return 'border-red-200 bg-red-50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'bad':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className={`metric-card rounded-xl p-4 border ${getStatusColor()} ${large ? 'col-span-2' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</div>
          <div className={`font-bold text-slate-900 ${large ? 'text-3xl' : 'text-2xl'}`}>{value}</div>
          {description && (
            <div className="text-xs text-slate-500 mt-1">{description}</div>
          )}
          <div className="text-xs text-slate-400 mt-2">Target: {target}</div>
        </div>
        {getStatusIcon()}
      </div>
    </div>
  );
}

export default function UnitEconomics({ metrics, inputs }: UnitEconomicsProps) {
  // Determine status for each metric
  const ltvCacStatus = metrics.ltvCacRatio >= 3 ? 'good' : metrics.ltvCacRatio >= 2 ? 'warning' : 'bad';
  const cacPaybackStatus = metrics.cacPaybackPeriod <= 12 ? 'good' : metrics.cacPaybackPeriod <= 18 ? 'warning' : 'bad';
  const magicNumberStatus = metrics.magicNumber >= 1 ? 'good' : metrics.magicNumber >= 0.75 ? 'warning' : 'bad';

  // Derive paid marketing spend from channels
  const paidMarketingSpend = inputs.paidSearchSpend + inputs.paidSocialSpend;

  // Visualize CAC breakdown
  const paidPercent = (paidMarketingSpend / inputs.totalSalesMarketing) * 100;
  const nonPaidPercent = 100 - paidPercent;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Unit Economics</h3>
            <p className="text-sm text-slate-500">Customer acquisition efficiency</p>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="LTV:CAC Ratio"
            value={`${metrics.ltvCacRatio.toFixed(1)}x`}
            target=">3.0x"
            status={ltvCacStatus}
            description="Lifetime value vs acquisition cost"
            large
          />
          <MetricCard
            label="CAC Payback"
            value={`${metrics.cacPaybackPeriod.toFixed(1)} mo`}
            target="<18 months"
            status={cacPaybackStatus}
            description="Months to recover CAC"
          />
          <MetricCard
            label="Magic Number"
            value={`${metrics.magicNumber.toFixed(2)}x`}
            target=">0.75x"
            status={magicNumberStatus}
            description="S&M efficiency ratio"
          />
        </div>

        {/* LTV & CAC Breakdown */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* LTV Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">LTV Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">ARPA (Monthly)</span>
                <span className="font-semibold text-slate-900">${Math.round(metrics.arpa).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Lifetime</span>
                <span className="font-semibold text-slate-900">{inputs.avgCustomerLifetime} months</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">Lifetime Value</span>
                <span className="text-lg font-bold text-green-600">
                  ${Math.round(metrics.ltv).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* CAC Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">CAC Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Blended CAC</span>
                <span className="font-semibold text-slate-900">
                  ${Math.round(metrics.cacBlended).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Paid CAC</span>
                <span className="font-semibold text-slate-900">
                  ${Math.round(metrics.cacPaidOnly).toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="text-xs text-slate-500">
                S&M Split
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${paidPercent}%` }}
                  title={`Paid: ${paidPercent.toFixed(0)}%`}
                />
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${nonPaidPercent}%` }}
                  title={`Other S&M: ${nonPaidPercent.toFixed(0)}%`}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Paid {paidPercent.toFixed(0)}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Other {nonPaidPercent.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paid Media Stats */}
      <div className="grid grid-cols-3 gap-px bg-slate-200 border-t border-slate-200">
        <div className="bg-slate-50 p-4 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">CPM</div>
          <div className="text-lg font-bold text-slate-900">${metrics.cpm.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">CPC</div>
          <div className="text-lg font-bold text-slate-900">${metrics.cpc.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">CTR</div>
          <div className="text-lg font-bold text-slate-900">{metrics.ctr.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}
