'use client';

import { Inputs, CalculatedMetrics } from '../types';
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

interface FunnelMetricsProps {
  inputs: Inputs;
  metrics: CalculatedMetrics;
}

interface FunnelStage {
  name: string;
  value: number;
  conversionRate?: number;
  nextStageName?: string;
}

export default function FunnelMetrics({ inputs, metrics }: FunnelMetricsProps) {
  const stages: FunnelStage[] = [
    {
      name: 'MQLs',
      value: inputs.mqlsGenerated,
      conversionRate: inputs.mqlToSQLConversion,
      nextStageName: 'SQLs',
    },
    {
      name: 'SQLs',
      value: metrics.sqlsGenerated,
      conversionRate: inputs.sqlToOppConversion,
      nextStageName: 'Opportunities',
    },
    {
      name: 'Opportunities',
      value: metrics.opportunitiesCreated,
      conversionRate: inputs.winRate,
      nextStageName: 'Closed Won',
    },
    {
      name: 'Closed Won',
      value: metrics.dealsClosedWon,
    },
  ];

  const overallConversion = (metrics.dealsClosedWon / inputs.mqlsGenerated) * 100;
  const maxValue = Math.max(...stages.map(s => s.value));

  const getBarWidth = (value: number) => {
    return Math.max((value / maxValue) * 100, 15);
  };

  const getConversionColor = (rate: number | undefined) => {
    if (!rate) return 'text-slate-400';
    if (rate >= 40) return 'text-green-600';
    if (rate >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Marketing Funnel</h3>
            <p className="text-sm text-slate-500">Lead-to-deal conversion pipeline</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">
              {overallConversion.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500">MQL to Won</div>
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="p-6">
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.name}>
              {/* Stage Row */}
              <div className="flex items-center gap-4">
                {/* Stage Label */}
                <div className="w-28 flex-shrink-0">
                  <div className="text-sm font-medium text-slate-700">{stage.name}</div>
                  <div className="text-xs text-slate-500">{stage.value.toLocaleString()}</div>
                </div>

                {/* Bar */}
                <div className="flex-1 h-10 bg-slate-100 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3 ${
                      index === stages.length - 1
                        ? 'bg-gradient-to-r from-green-500 to-green-400'
                        : 'bg-gradient-to-r from-blue-500 to-blue-400'
                    }`}
                    style={{ width: `${getBarWidth(stage.value)}%` }}
                  >
                    <span className="text-white font-semibold text-sm">
                      {stage.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conversion Arrow */}
              {stage.conversionRate !== undefined && index < stages.length - 1 && (
                <div className="flex items-center gap-4 my-2">
                  <div className="w-28 flex-shrink-0" />
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowDownIcon className={`w-4 h-4 ${getConversionColor(stage.conversionRate)}`} />
                    <span className={`font-semibold ${getConversionColor(stage.conversionRate)}`}>
                      {stage.conversionRate}%
                    </span>
                    <span className="text-slate-400">
                      conversion to {stage.nextStageName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cost Metrics */}
      <div className="grid grid-cols-3 gap-px bg-slate-200 border-t border-slate-200">
        <div className="bg-slate-50 p-4 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Cost/MQL</div>
          <div className="text-lg font-bold text-slate-900">
            ${Math.round(metrics.costPerMQL).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Cost/SQL</div>
          <div className="text-lg font-bold text-slate-900">
            ${Math.round(metrics.costPerSQL).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Pipeline</div>
          <div className="text-lg font-bold text-slate-900">
            ${(metrics.pipelineGenerated / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Velocity & Cycle */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-sm text-slate-500">Sales Cycle: </span>
              <span className="font-semibold text-slate-900">{inputs.salesCycle} months</span>
            </div>
            <div>
              <span className="text-sm text-slate-500">Avg Deal Size: </span>
              <span className="font-semibold text-slate-900">${inputs.avgDealSize}K</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRightIcon className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-slate-500">Velocity: </span>
            <span className="font-semibold text-slate-900">
              ${Math.round(metrics.pipelineVelocity).toLocaleString()}/day
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
