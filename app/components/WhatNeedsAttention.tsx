'use client';

import { CalculatedMetrics } from '../types';
import { getMetricDefinition } from '../utils/metricDefinitions';

interface WhatNeedsAttentionProps {
  metrics: CalculatedMetrics;
}

interface AttentionItem {
  metric: string;
  value: string;
  benchmark: string;
  variance: string;
  severity: 'critical' | 'moderate' | 'watch';
  recommendation: string;
}

function getAttentionItems(metrics: CalculatedMetrics): AttentionItem[] {
  const items: AttentionItem[] = [];

  // LTV:CAC
  if (metrics.ltvCacRatio < 3) {
    const variance = ((metrics.ltvCacRatio - 3) / 3 * 100).toFixed(0);
    items.push({
      metric: 'LTV:CAC Ratio',
      value: `${metrics.ltvCacRatio.toFixed(1)}x`,
      benchmark: '3.0x',
      variance: `${variance}%`,
      severity: metrics.ltvCacRatio < 2 ? 'critical' : 'moderate',
      recommendation: metrics.ltvCacRatio < 2
        ? 'Reduce CAC or increase deal size immediately'
        : 'Improve conversion rates or extend customer lifetime'
    });
  }

  // CAC Payback
  if (metrics.cacPaybackPeriod > 18) {
    const variance = ((metrics.cacPaybackPeriod - 18) / 18 * 100).toFixed(0);
    items.push({
      metric: 'CAC Payback',
      value: `${metrics.cacPaybackPeriod.toFixed(0)} mo`,
      benchmark: '<18 mo',
      variance: `+${variance}%`,
      severity: metrics.cacPaybackPeriod > 24 ? 'critical' : 'moderate',
      recommendation: 'Review pricing strategy and sales cycle efficiency'
    });
  }

  // Gross Retention
  if (metrics.annualizedGRR < 90) {
    const variance = ((metrics.annualizedGRR - 90) / 90 * 100).toFixed(0);
    items.push({
      metric: 'Gross Retention',
      value: `${metrics.annualizedGRR.toFixed(0)}%`,
      benchmark: '>90%',
      variance: `${variance}%`,
      severity: metrics.annualizedGRR < 80 ? 'critical' : 'moderate',
      recommendation: 'Audit churn reasons and strengthen customer success'
    });
  }

  // Net Retention
  if (metrics.annualizedNRR < 100) {
    const variance = ((metrics.annualizedNRR - 100) / 100 * 100).toFixed(0);
    items.push({
      metric: 'Net Retention',
      value: `${metrics.annualizedNRR.toFixed(0)}%`,
      benchmark: '>100%',
      variance: `${variance}%`,
      severity: metrics.annualizedNRR < 90 ? 'critical' : 'moderate',
      recommendation: 'Increase expansion selling and reduce downgrades'
    });
  }

  // Magic Number
  if (metrics.magicNumber < 0.75) {
    const variance = ((metrics.magicNumber - 0.75) / 0.75 * 100).toFixed(0);
    items.push({
      metric: 'Magic Number',
      value: `${metrics.magicNumber.toFixed(2)}x`,
      benchmark: '>0.75x',
      variance: `${variance}%`,
      severity: metrics.magicNumber < 0.5 ? 'critical' : 'moderate',
      recommendation: 'Optimize S&M spend allocation or improve win rates'
    });
  }

  // Logo Churn
  if (metrics.logoChurnRate > 1.5) {
    const variance = ((metrics.logoChurnRate - 1.5) / 1.5 * 100).toFixed(0);
    items.push({
      metric: 'Logo Churn',
      value: `${metrics.logoChurnRate.toFixed(1)}%`,
      benchmark: '<1.5%',
      variance: `+${variance}%`,
      severity: metrics.logoChurnRate > 3 ? 'critical' : 'moderate',
      recommendation: 'Implement early warning system for at-risk accounts'
    });
  }

  // Rule of 40
  if (metrics.ruleOf40 < 40) {
    const variance = ((metrics.ruleOf40 - 40) / 40 * 100).toFixed(0);
    items.push({
      metric: 'Rule of 40',
      value: `${metrics.ruleOf40.toFixed(0)}%`,
      benchmark: '>40%',
      variance: `${variance}%`,
      severity: metrics.ruleOf40 < 25 ? 'critical' : 'moderate',
      recommendation: 'Balance growth investment against profitability'
    });
  }

  // Gross Margin
  if (metrics.grossMargin < 75) {
    const variance = ((metrics.grossMargin - 75) / 75 * 100).toFixed(0);
    items.push({
      metric: 'Gross Margin',
      value: `${metrics.grossMargin.toFixed(0)}%`,
      benchmark: '>75%',
      variance: `${variance}%`,
      severity: metrics.grossMargin < 65 ? 'critical' : 'moderate',
      recommendation: 'Review COGS structure and pricing'
    });
  }

  // Quick Ratio
  if (metrics.saasQuickRatio < 4) {
    items.push({
      metric: 'Quick Ratio',
      value: `${metrics.saasQuickRatio.toFixed(1)}x`,
      benchmark: '>4.0x',
      variance: `${((metrics.saasQuickRatio - 4) / 4 * 100).toFixed(0)}%`,
      severity: metrics.saasQuickRatio < 2 ? 'critical' : 'watch',
      recommendation: 'Increase new bookings or reduce churn rate'
    });
  }

  // Sort by severity
  const severityOrder = { critical: 0, moderate: 1, watch: 2 };
  items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return items;
}

export default function WhatNeedsAttention({ metrics }: WhatNeedsAttentionProps) {
  const items = getAttentionItems(metrics);

  if (items.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">
          What Needs Attention
        </h2>
        <p className="text-slate-600">
          All key metrics are within acceptable ranges. Continue monitoring for changes.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          What Needs Attention
        </h2>
        <span className="text-sm text-slate-500">
          {items.filter(i => i.severity === 'critical').length} critical, {items.filter(i => i.severity === 'moderate').length} moderate
        </span>
      </div>

      <div className="border border-slate-200">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wide">
          <div className="col-span-3">Metric</div>
          <div className="col-span-2 text-right">Current</div>
          <div className="col-span-2 text-right">Target</div>
          <div className="col-span-2 text-right">Variance</div>
          <div className="col-span-3">Action</div>
        </div>

        {/* Rows */}
        {items.map((item, index) => {
          const definition = getMetricDefinition(item.metric);
          return (
            <div
              key={item.metric}
              className={`relative grid grid-cols-12 gap-4 px-4 py-3 ${
                index < items.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              {/* Severity indicator */}
              <div
                className={`absolute left-0 top-0 w-1 h-full ${
                  item.severity === 'critical' ? 'bg-rose-500' :
                  item.severity === 'moderate' ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              />

              <div className="col-span-3">
                <div className="font-medium text-slate-900">{item.metric}</div>
                {definition && (
                  <div className="text-xs text-slate-500 mt-0.5 formula-trigger relative cursor-help">
                    View formula
                    <div className="formula-tooltip left-0 top-full mt-1">
                      {definition.formula}
                    </div>
                  </div>
                )}
              </div>
              <div className="col-span-2 text-right tabular-nums font-medium text-slate-900">
                {item.value}
              </div>
              <div className="col-span-2 text-right tabular-nums text-slate-500">
                {item.benchmark}
              </div>
              <div className={`col-span-2 text-right tabular-nums font-medium ${
                item.severity === 'critical' ? 'text-rose-600' :
                item.severity === 'moderate' ? 'text-amber-600' : 'text-slate-600'
              }`}>
                {item.variance}
              </div>
              <div className="col-span-3 text-sm text-slate-600">
                {item.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
