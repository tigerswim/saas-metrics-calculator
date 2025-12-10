'use client';

import { CalculatedMetrics, Inputs } from '../types';
import { getMetricDefinition } from '../utils/metricDefinitions';

interface GrowthTrajectoryProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

export default function GrowthTrajectory({ metrics, inputs }: GrowthTrajectoryProps) {
  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}M`;
    }
    return `$${value.toFixed(0)}K`;
  };

  // ARR Movement data
  const arrMovement = [
    { label: 'Beginning ARR', value: inputs.beginningARR * 1000, type: 'base' },
    { label: 'New Bookings', value: metrics.newBookings, type: 'add' },
    { label: 'Expansion', value: inputs.expansionARR, type: 'add' },
    { label: 'Churned', value: -inputs.churnedARR, type: 'subtract' },
    { label: 'Ending ARR', value: metrics.endingARR * 1000, type: 'total' },
  ];

  // Retention metrics
  const retentionMetrics = [
    {
      label: 'Gross Revenue Retention',
      monthly: `${metrics.grr.toFixed(1)}%`,
      annual: `${metrics.annualizedGRR.toFixed(0)}%`,
      benchmark: '>90%',
      status: metrics.annualizedGRR >= 90 ? 'good' : metrics.annualizedGRR >= 80 ? 'warning' : 'bad'
    },
    {
      label: 'Net Revenue Retention',
      monthly: `${metrics.nrr.toFixed(1)}%`,
      annual: `${metrics.annualizedNRR.toFixed(0)}%`,
      benchmark: '>110%',
      status: metrics.annualizedNRR >= 110 ? 'good' : metrics.annualizedNRR >= 100 ? 'warning' : 'bad'
    },
  ];

  // Customer metrics
  const customerMetrics = [
    { label: 'Beginning Customers', value: inputs.totalCustomers.toLocaleString() },
    { label: 'New Customers', value: `+${inputs.newCustomersAdded}` },
    { label: 'Churned Customers', value: `-${inputs.customersChurned}` },
    { label: 'Ending Customers', value: metrics.endingCustomerCount.toLocaleString() },
    { label: 'Logo Churn Rate', value: `${metrics.logoChurnRate.toFixed(2)}%/mo`, benchmark: '<1.5%' },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">
        Growth Trajectory
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ARR Movement */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            ARR Movement
          </h3>
          <div className="border border-slate-200">
            {arrMovement.map((item, index) => (
              <div
                key={item.label}
                className={`flex justify-between items-center px-4 py-2 ${
                  index < arrMovement.length - 1 ? 'border-b border-slate-100' : ''
                } ${item.type === 'total' ? 'bg-slate-50 font-medium' : ''}`}
              >
                <span className={`text-sm ${item.type === 'total' ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.label}
                </span>
                <span className={`tabular-nums text-sm ${
                  item.type === 'add' ? 'text-emerald-600' :
                  item.type === 'subtract' ? 'text-rose-600' :
                  item.type === 'total' ? 'text-slate-900 font-semibold' :
                  'text-slate-900'
                }`}>
                  {item.type === 'add' ? '+' : ''}{formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="text-center py-2 bg-blue-50 border border-blue-100">
              <div className={`text-lg font-semibold tabular-nums ${
                metrics.arrGrowthRateMonthly >= 0 ? 'text-blue-600' : 'text-rose-600'
              }`}>
                {metrics.arrGrowthRateMonthly >= 0 ? '+' : ''}{metrics.arrGrowthRateMonthly.toFixed(2)}%
              </div>
              <div className="text-xs text-slate-500">Monthly</div>
            </div>
            <div className="text-center py-2 bg-blue-50 border border-blue-100">
              <div className={`text-lg font-semibold tabular-nums ${
                metrics.annualizedGrowthRate >= 20 ? 'text-blue-600' : 'text-slate-700'
              }`}>
                {metrics.annualizedGrowthRate.toFixed(0)}%
              </div>
              <div className="text-xs text-slate-500">Annualized</div>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Customers
          </h3>
          <div className="border border-slate-200">
            {customerMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`flex justify-between items-center px-4 py-2 ${
                  index < customerMetrics.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <span className="text-sm text-slate-700">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`tabular-nums text-sm font-medium ${
                    metric.value.startsWith('+') ? 'text-emerald-600' :
                    metric.value.startsWith('-') ? 'text-rose-600' :
                    'text-slate-900'
                  }`}>
                    {metric.value}
                  </span>
                  {metric.benchmark && (
                    <span className="text-xs text-slate-400">{metric.benchmark}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Retention
          </h3>
          <div className="border border-slate-200">
            {/* Header */}
            <div className="grid grid-cols-4 gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
              <div className="col-span-1">Metric</div>
              <div className="text-right">Monthly</div>
              <div className="text-right">Annual</div>
              <div className="text-right">Target</div>
            </div>
            {retentionMetrics.map((metric, index) => {
              const definition = getMetricDefinition(metric.label.includes('Gross') ? 'GRR' : 'NRR');
              return (
                <div
                  key={metric.label}
                  className={`relative grid grid-cols-4 gap-1 px-3 py-2 ${
                    index < retentionMetrics.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 w-1 h-full ${
                      metric.status === 'good' ? 'bg-emerald-500' :
                      metric.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                  <div className="col-span-1">
                    <div className="font-medium text-slate-900 text-sm">
                      {metric.label.includes('Gross') ? 'GRR' : 'NRR'}
                    </div>
                    {definition && (
                      <div className="text-xs text-slate-500 formula-trigger relative cursor-help">
                        Formula
                        <div className="formula-tooltip left-0 top-full mt-1 w-64">
                          {definition.formula}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right tabular-nums text-sm text-slate-600">{metric.monthly}</div>
                  <div className="text-right tabular-nums text-sm font-medium text-slate-900">{metric.annual}</div>
                  <div className="text-right tabular-nums text-xs text-slate-500">{metric.benchmark}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
