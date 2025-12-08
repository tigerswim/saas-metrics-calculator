'use client';

import { CalculatedMetrics, Inputs } from '../types';
import { getMetricDefinition } from '../utils/metricDefinitions';

interface UnitEconomicsTableProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

export default function UnitEconomicsTable({ metrics, inputs }: UnitEconomicsTableProps) {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Core unit economics
  const coreMetrics = [
    {
      label: 'Customer Lifetime Value',
      shortLabel: 'LTV',
      value: formatCurrency(metrics.ltv),
      benchmark: 'varies',
      formula: 'ARPA × Avg Lifetime'
    },
    {
      label: 'CAC (Blended)',
      shortLabel: 'CAC',
      value: formatCurrency(metrics.cacBlended * 1000),
      benchmark: 'varies',
      formula: 'Total S&M / New Customers'
    },
    {
      label: 'LTV:CAC Ratio',
      shortLabel: 'LTV:CAC',
      value: `${metrics.ltvCacRatio.toFixed(1)}x`,
      benchmark: '>3.0x',
      formula: 'LTV / CAC',
      status: metrics.ltvCacRatio >= 3 ? 'good' : metrics.ltvCacRatio >= 2 ? 'warning' : 'bad'
    },
    {
      label: 'CAC Payback Period',
      shortLabel: 'Payback',
      value: `${metrics.cacPaybackPeriod.toFixed(1)} mo`,
      benchmark: '<18 mo',
      formula: 'CAC / (ARPA × Gross Margin)',
      status: metrics.cacPaybackPeriod <= 12 ? 'good' : metrics.cacPaybackPeriod <= 18 ? 'warning' : 'bad'
    },
  ];

  // Customer metrics
  const customerMetrics = [
    {
      label: 'Average Revenue Per Account',
      shortLabel: 'ARPA',
      value: `${formatCurrency(metrics.arpa)}/mo`,
      benchmark: 'varies',
    },
    {
      label: 'Avg Customer Lifetime',
      value: `${inputs.avgCustomerLifetime} mo`,
      benchmark: 'varies',
    },
    {
      label: 'Gross Margin',
      value: `${metrics.grossMargin.toFixed(0)}%`,
      benchmark: '>75%',
      status: metrics.grossMargin >= 75 ? 'good' : metrics.grossMargin >= 65 ? 'warning' : 'bad'
    },
  ];

  // Acquisition costs breakdown
  const acquisitionMetrics = [
    {
      label: 'Total S&M Spend',
      value: formatCurrency(inputs.totalSalesMarketing * 1000),
    },
    {
      label: 'Marketing Spend',
      value: formatCurrency(inputs.totalMarketingSpend * 1000),
    },
    {
      label: 'Paid Marketing Spend',
      value: formatCurrency(inputs.paidMarketingSpend * 1000),
    },
    {
      label: 'CAC (Paid Only)',
      value: formatCurrency(metrics.cacPaidOnly * 1000),
      benchmark: 'varies',
    },
    {
      label: 'New Customers Added',
      value: inputs.newCustomersAdded.toString(),
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">
        Unit Economics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Unit Economics */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Core Metrics
          </h3>
          <div className="border border-slate-200">
            {coreMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`relative px-4 py-3 ${
                  index < coreMetrics.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                {metric.status && (
                  <div
                    className={`absolute left-0 top-0 w-1 h-full ${
                      metric.status === 'good' ? 'bg-emerald-500' :
                      metric.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-slate-900 text-sm">
                      {metric.shortLabel || metric.label}
                    </div>
                    <div className="text-xs text-slate-500 formula-trigger relative cursor-help">
                      {metric.formula}
                      {getMetricDefinition(metric.shortLabel || metric.label) && (
                        <div className="formula-tooltip left-0 top-full mt-1 w-64">
                          {getMetricDefinition(metric.shortLabel || metric.label)?.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums text-slate-900">{metric.value}</div>
                    <div className="text-xs text-slate-400">{metric.benchmark}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Economics */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Customer Value
          </h3>
          <div className="border border-slate-200">
            {customerMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`relative px-4 py-3 ${
                  index < customerMetrics.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                {metric.status && (
                  <div
                    className={`absolute left-0 top-0 w-1 h-full ${
                      metric.status === 'good' ? 'bg-emerald-500' :
                      metric.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">{metric.shortLabel || metric.label}</span>
                  <div className="text-right">
                    <span className="font-medium tabular-nums text-slate-900">{metric.value}</span>
                    {metric.benchmark && (
                      <span className="text-xs text-slate-400 ml-2">{metric.benchmark}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acquisition Costs */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Acquisition Costs
          </h3>
          <div className="border border-slate-200">
            {acquisitionMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`flex justify-between items-center px-4 py-3 ${
                  index < acquisitionMetrics.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <span className="text-sm text-slate-700">{metric.label}</span>
                <div className="text-right">
                  <span className="font-medium tabular-nums text-slate-900">{metric.value}</span>
                  {metric.benchmark && (
                    <span className="text-xs text-slate-400 ml-2">{metric.benchmark}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
