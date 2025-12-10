'use client';

import { CalculatedMetrics, Inputs } from '../types';
import { getMetricDefinition } from '../utils/metricDefinitions';

interface FinancialPositionProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

export default function FinancialPosition({ metrics, inputs }: FinancialPositionProps) {
  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absValue >= 1000) {
      return `${sign}$${(absValue / 1000).toFixed(1)}M`;
    }
    return `${sign}$${absValue.toFixed(0)}K`;
  };

  // P&L Summary
  const pnlItems = [
    { label: 'Monthly Revenue', value: metrics.monthlyRevenue, type: 'revenue' },
    { label: 'COGS', value: metrics.monthlyRevenue * (inputs.cogsPercent / 100), type: 'cost' },
    { label: 'Gross Profit', value: metrics.grossProfit, type: 'subtotal' },
    { label: 'Sales & Marketing', value: inputs.totalSalesMarketing, type: 'cost' },
    { label: 'R&D', value: inputs.rdSpend, type: 'cost' },
    { label: 'General & Administrative', value: inputs.gaSpend, type: 'cost' },
    { label: 'Total OpEx', value: metrics.totalOpEx, type: 'subtotal' },
    { label: 'EBITDA', value: metrics.ebitda, type: 'total' },
  ];

  // Efficiency metrics
  const efficiencyMetrics = [
    {
      label: 'Gross Margin',
      value: `${metrics.grossMargin.toFixed(0)}%`,
      benchmark: '>75%',
      status: metrics.grossMargin >= 75 ? 'good' : metrics.grossMargin >= 65 ? 'warning' : 'bad'
    },
    {
      label: 'EBITDA Margin',
      value: `${metrics.ebitdaMargin.toFixed(0)}%`,
      benchmark: 'varies',
      status: metrics.ebitdaMargin >= 0 ? 'good' : metrics.ebitdaMargin >= -20 ? 'warning' : 'bad'
    },
    {
      label: 'Rule of 40',
      value: `${metrics.ruleOf40.toFixed(0)}%`,
      benchmark: '>40%',
      status: metrics.ruleOf40 >= 40 ? 'good' : metrics.ruleOf40 >= 25 ? 'warning' : 'bad'
    },
    {
      label: 'Quick Ratio',
      value: `${metrics.saasQuickRatio.toFixed(1)}x`,
      benchmark: '>4.0x',
      status: metrics.saasQuickRatio >= 4 ? 'good' : metrics.saasQuickRatio >= 2 ? 'warning' : 'bad'
    },
    {
      label: 'Burn Multiple',
      value: metrics.burnMultiple === 0 ? 'N/A (profitable)' : `${metrics.burnMultiple.toFixed(1)}x`,
      benchmark: '<1.5x',
      status: metrics.burnMultiple === 0 ? 'good' : metrics.burnMultiple <= 1.0 ? 'good' : metrics.burnMultiple <= 1.5 ? 'warning' : 'bad'
    },
  ];

  // Spend breakdown
  const spendBreakdown = [
    { label: 'Sales & Marketing', value: inputs.totalSalesMarketing, percent: (inputs.totalSalesMarketing / metrics.totalOpEx * 100), color: 'bg-blue-500' },
    { label: 'R&D', value: inputs.rdSpend, percent: (inputs.rdSpend / metrics.totalOpEx * 100), color: 'bg-violet-500' },
    { label: 'General & Administrative', value: inputs.gaSpend, percent: (inputs.gaSpend / metrics.totalOpEx * 100), color: 'bg-slate-400' },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">
        Financial Position
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* P&L Summary */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Monthly P&L
          </h3>
          <div className="border border-slate-200">
            {pnlItems.map((item, index) => (
              <div
                key={item.label}
                className={`flex justify-between items-center px-4 py-2 ${
                  index < pnlItems.length - 1 ? 'border-b border-slate-100' : ''
                } ${item.type === 'subtotal' || item.type === 'total' ? 'bg-slate-50' : ''}`}
              >
                <span className={`text-sm ${
                  item.type === 'total' ? 'font-semibold text-slate-900' :
                  item.type === 'subtotal' ? 'font-medium text-slate-900' :
                  'text-slate-700'
                }`}>
                  {item.label}
                </span>
                <span className={`tabular-nums ${
                  item.type === 'total' ? 'font-semibold' : 'font-medium'
                } ${
                  item.type === 'cost' ? 'text-slate-600' :
                  item.type === 'total' && item.value < 0 ? 'text-rose-600' :
                  item.type === 'total' && item.value >= 0 ? 'text-emerald-600' :
                  'text-slate-900'
                }`}>
                  {item.type === 'cost' ? `(${formatCurrency(item.value)})` : formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Efficiency
          </h3>
          <div className="border border-slate-200">
            {efficiencyMetrics.map((metric, index) => {
              const definition = getMetricDefinition(metric.label);
              return (
                <div
                  key={metric.label}
                  className={`relative px-4 py-3 ${
                    index < efficiencyMetrics.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 w-1 h-full ${
                      metric.status === 'good' ? 'bg-emerald-500' :
                      metric.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{metric.label}</div>
                      {definition && (
                        <div className="text-xs text-slate-500 formula-trigger relative cursor-help">
                          {definition.formula}
                          <div className="formula-tooltip left-0 top-full mt-1 w-64">
                            {definition.description}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold tabular-nums text-slate-900">{metric.value}</div>
                      <div className="text-xs text-slate-400">{metric.benchmark}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OpEx Breakdown */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            OpEx Allocation
          </h3>
          <div className="border border-slate-200 p-4">
            <div className="space-y-4">
              {spendBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm text-slate-700 leading-tight max-w-[140px]">{item.label}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="tabular-nums font-medium text-slate-900">
                        {formatCurrency(item.value)}
                      </span>
                      <span className="text-xs text-slate-500 w-10 text-right">
                        {item.percent.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-900">Total OpEx</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {formatCurrency(metrics.totalOpEx)}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {((metrics.totalOpEx / metrics.monthlyRevenue) * 100).toFixed(0)}% of revenue
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
