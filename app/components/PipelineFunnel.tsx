'use client';

import { CalculatedMetrics, Inputs } from '../types';

interface PipelineFunnelProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

interface FunnelStage {
  label: string;
  value: number;
  conversionTo?: number;
  conversionLabel?: string;
}

export default function PipelineFunnel({ metrics, inputs }: PipelineFunnelProps) {
  // Calculate Lead to MQL conversion rate
  const leadToMqlRate = inputs.leadsGenerated > 0
    ? (inputs.mqlsGenerated / inputs.leadsGenerated) * 100
    : 0;

  const stages: FunnelStage[] = [
    {
      label: 'Leads',
      value: inputs.leadsGenerated,
      conversionTo: leadToMqlRate,
      conversionLabel: 'Lead→MQL'
    },
    {
      label: 'MQLs',
      value: inputs.mqlsGenerated,
      conversionTo: inputs.mqlToSQLConversion,
      conversionLabel: 'MQL→SQL'
    },
    {
      label: 'SQLs',
      value: metrics.sqlsGenerated,
      conversionTo: inputs.sqlToOppConversion,
      conversionLabel: 'SQL→Opp'
    },
    {
      label: 'Opps',
      value: metrics.opportunitiesCreated,
      conversionTo: inputs.winRate,
      conversionLabel: 'Win Rate'
    },
    {
      label: 'Won',
      value: metrics.dealsClosedWon,
    },
  ];

  // Calculate max for relative sizing
  const maxValue = Math.max(...stages.map(s => s.value));

  // Pipeline metrics
  const pipelineMetrics = [
    { label: 'Pipeline Generated', value: `$${(metrics.pipelineGenerated / 1000).toFixed(0)}K` },
    { label: 'Pipeline Velocity', value: `$${metrics.pipelineVelocity.toFixed(0)}/day` },
    { label: 'Avg Deal Size', value: `$${inputs.avgDealSize}K` },
    { label: 'Sales Cycle', value: `${inputs.salesCycle} mo` },
    { label: 'Overall Conversion', value: `${metrics.pipelineConversion.toFixed(1)}%` },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">
        Pipeline Funnel
      </h2>

      <div className="border border-slate-200">
        {/* Funnel Visualization */}
        <div className="p-6">
          <div className="flex items-end justify-between gap-2">
            {stages.map((stage, index) => {
              // Scale height properly: max 120px, min 8px for visibility
              const maxHeight = 120;
              const minHeight = 8;
              const scaledHeight = Math.max(minHeight, (stage.value / maxValue) * maxHeight);
              const isLast = index === stages.length - 1;

              return (
                <div key={stage.label} className="flex-1 flex items-end gap-2">
                  {/* Stage Bar */}
                  <div className="flex-1">
                    <div className="text-center mb-2">
                      <div className="text-2xl font-semibold tabular-nums text-slate-900">
                        {stage.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        {stage.label}
                      </div>
                    </div>
                    <div
                      className="transition-all duration-300"
                      style={{
                        height: `${scaledHeight}px`,
                        background: `linear-gradient(to bottom, ${
                          index === 0 ? '#c4b5fd, #8b5cf6' :
                          index === 1 ? '#93c5fd, #3b82f6' :
                          index === 2 ? '#60a5fa, #2563eb' :
                          index === 3 ? '#3b82f6, #1d4ed8' :
                          '#22c55e, #16a34a'
                        })`
                      }}
                    />
                  </div>

                  {/* Conversion Arrow */}
                  {!isLast && stage.conversionTo !== undefined && (
                    <div className="flex flex-col items-center justify-end pb-4 min-w-[60px]">
                      <div className="text-xs text-slate-400 mb-1 text-center">
                        {stage.conversionLabel}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="text-sm font-medium tabular-nums text-slate-700">
                          {stage.conversionTo.toFixed(0)}%
                        </div>
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Metrics Row */}
        <div className="grid grid-cols-5 border-t border-slate-200 bg-slate-50">
          {pipelineMetrics.map((metric) => (
            <div key={metric.label} className="px-4 py-3 text-center border-r border-slate-200 last:border-r-0">
              <div className="text-sm font-medium tabular-nums text-slate-900">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
