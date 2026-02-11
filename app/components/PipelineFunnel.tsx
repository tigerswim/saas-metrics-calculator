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

  // Derive total marketing spend from channels
  const totalMarketingSpend = inputs.paidSearchSpend + inputs.paidSocialSpend + inputs.eventsSpend + inputs.contentSpend + inputs.partnershipsSpend;

  // Pipeline metrics
  const pipelineMetrics = [
    { label: 'Pipeline Generated', value: `$${(metrics.pipelineGenerated / 1000).toFixed(1)}M` },
    { label: 'Pipeline Velocity', value: `$${(metrics.pipelineVelocity / 1000).toFixed(1)}K/day` },
    { label: 'Avg Deal Size', value: `$${inputs.avgDealSize}K` },
    { label: 'Sales Cycle', value: `${inputs.salesCycle} mo` },
  ];

  // Funnel economics - cost per stage
  const costPerLead = inputs.leadsGenerated > 0 ? (totalMarketingSpend * 1000) / inputs.leadsGenerated : 0;
  const costPerMQL = inputs.mqlsGenerated > 0 ? (totalMarketingSpend * 1000) / inputs.mqlsGenerated : 0;
  const costPerSQL = metrics.sqlsGenerated > 0 ? (totalMarketingSpend * 1000) / metrics.sqlsGenerated : 0;
  const costPerOpp = metrics.opportunitiesCreated > 0 ? (totalMarketingSpend * 1000) / metrics.opportunitiesCreated : 0;
  const costPerWon = metrics.dealsClosedWon > 0 ? (totalMarketingSpend * 1000) / metrics.dealsClosedWon : 0;

  const funnelEconomics = [
    { label: 'Cost/Lead', value: `$${costPerLead.toFixed(0)}` },
    { label: 'Cost/MQL', value: `$${costPerMQL.toFixed(0)}` },
    { label: 'Cost/SQL', value: `$${costPerSQL.toFixed(0)}` },
    { label: 'Cost/Opp', value: `$${costPerOpp.toLocaleString(undefined, {maximumFractionDigits: 0})}` },
    { label: 'Cost/Won', value: `$${costPerWon.toLocaleString(undefined, {maximumFractionDigits: 0})}` },
  ];

  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 mb-3 sm:mb-4">
        Pipeline Funnel
      </h2>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        {/* Funnel Visualization - Desktop: Horizontal, Mobile: Vertical Cascade */}
        <div className="p-4 sm:p-6">
          {/* Mobile: Vertical Stack */}
          <div className="md:hidden space-y-3">
            {stages.map((stage, index) => {
              const isLast = index === stages.length - 1;
              const widthPercent = (stage.value / maxValue) * 100;

              return (
                <div key={stage.label}>
                  {/* Stage Card */}
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          {stage.label}
                        </div>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums">
                          {stage.value.toLocaleString()}
                        </div>
                      </div>
                      {funnelEconomics[index] && (
                        <div className="text-right">
                          <div className="text-xs text-slate-500 mb-1">Cost</div>
                          <div className="text-lg font-semibold text-blue-600 tabular-nums">
                            {funnelEconomics[index].value}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Visual Bar */}
                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                        style={{
                          width: `${widthPercent}%`,
                          background: `linear-gradient(to right, ${
                            index === 0 ? '#c4b5fd, #8b5cf6' :
                            index === 1 ? '#93c5fd, #3b82f6' :
                            index === 2 ? '#60a5fa, #2563eb' :
                            index === 3 ? '#3b82f6, #1d4ed8' :
                            '#22c55e, #16a34a'
                          })`
                        }}
                      />
                    </div>
                  </div>

                  {/* Conversion Connector */}
                  {!isLast && stage.conversionTo !== undefined && (
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
                        <svg className="w-4 h-4 text-slate-400 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <div className="text-sm font-medium text-slate-700 tabular-nums">
                          {stage.conversionTo.toFixed(0)}% <span className="text-xs text-slate-500">{stage.conversionLabel}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop: Horizontal Bars (Preserved) */}
          <div className="hidden md:flex items-end justify-between gap-2">
            {stages.map((stage, index) => {
              // Scale height properly: max 120px, min 8px for visibility
              const maxHeight = 120;
              const minHeight = 8;
              const scaledHeight = Math.max(minHeight, (stage.value / maxValue) * maxHeight);
              const isLast = index === stages.length - 1;

              return (
                <div key={stage.label} className="flex items-end gap-2">
                  {/* Stage Bar */}
                  <div className="w-32">
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

        {/* Pipeline Metrics - Mobile: 2-col grid, Desktop: 4-col row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 border-t border-slate-200 bg-slate-50 p-4 md:p-0">
          {pipelineMetrics.map((metric) => (
            <div key={metric.label} className="md:px-4 md:py-3 text-center md:border-r md:border-slate-200 md:last:border-r-0">
              <div className="text-base sm:text-sm font-semibold sm:font-medium tabular-nums text-slate-900">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Funnel Economics - Hidden on mobile (shown in cards above) */}
        <div className="hidden md:grid grid-cols-5 border-t border-slate-200">
          {funnelEconomics.map((metric) => (
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
