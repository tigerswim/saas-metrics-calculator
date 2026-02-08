'use client';

import { CalculatedMetrics, Inputs } from '../types';
import { getMetricDefinition } from '../utils/metricDefinitions';

interface WhereToInvestProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

interface InvestmentSignal {
  area: string;
  signal: 'increase' | 'maintain' | 'reduce';
  rationale: string;
  metrics: Array<{ label: string; value: string; benchmark: string }>;
}

function getInvestmentSignals(metrics: CalculatedMetrics, inputs: Inputs): InvestmentSignal[] {
  const signals: InvestmentSignal[] = [];

  // Sales & Marketing Investment Signal
  const smSignal: InvestmentSignal = {
    area: 'Sales & Marketing',
    signal: metrics.magicNumber >= 1.0 ? 'increase' :
            metrics.magicNumber >= 0.75 ? 'maintain' : 'reduce',
    rationale: metrics.magicNumber >= 1.0
      ? 'High efficiency justifies accelerated investment'
      : metrics.magicNumber >= 0.75
        ? 'Efficiency is acceptable—maintain current levels'
        : 'Low efficiency suggests reallocation or optimization needed',
    metrics: [
      { label: 'Magic Number', value: `${metrics.magicNumber.toFixed(2)}x`, benchmark: '>0.75x' },
      { label: 'CAC Payback', value: `${metrics.cacPaybackPeriod.toFixed(0)} mo`, benchmark: '<18 mo' },
      { label: 'CAC Blended', value: `$${Math.round(metrics.cacBlended * 1000).toLocaleString()}`, benchmark: 'varies' },
    ]
  };
  signals.push(smSignal);

  // Paid Marketing Signal
  const paidSignal: InvestmentSignal = {
    area: 'Paid Acquisition',
    signal: metrics.ctr > 2 && metrics.cacBlended * 1000 < metrics.ltv / 3 ? 'increase' :
            metrics.ctr > 1 && metrics.cacBlended * 1000 < metrics.ltv / 2 ? 'maintain' : 'reduce',
    rationale: metrics.ctr > 2 && metrics.cacBlended * 1000 < metrics.ltv / 3
      ? 'Strong engagement and unit economics support scaling'
      : metrics.ctr > 1
        ? 'Acceptable performance—optimize before scaling'
        : 'Low engagement or high CAC requires channel review',
    metrics: [
      { label: 'CTR', value: `${metrics.ctr.toFixed(2)}%`, benchmark: '>2%' },
      { label: 'CPC', value: `$${Math.round(metrics.cpc).toLocaleString()}`, benchmark: 'varies' },
      { label: 'CAC (Blended)', value: `$${Math.round(metrics.cacBlended * 1000).toLocaleString()}`, benchmark: 'varies' },
    ]
  };
  signals.push(paidSignal);

  // Customer Success / Retention Signal
  const retentionSignal: InvestmentSignal = {
    area: 'Customer Success',
    signal: metrics.annualizedGRR < 85 ? 'increase' :
            metrics.annualizedNRR < 110 ? 'maintain' : 'maintain',
    rationale: metrics.annualizedGRR < 85
      ? 'High churn demands immediate CS investment'
      : metrics.annualizedNRR < 110
        ? 'Retention healthy but expansion revenue opportunity exists'
        : 'Strong retention—maintain current investment',
    metrics: [
      { label: 'GRR (Annual)', value: `${metrics.annualizedGRR.toFixed(0)}%`, benchmark: '>90%' },
      { label: 'NRR (Annual)', value: `${metrics.annualizedNRR.toFixed(0)}%`, benchmark: '>110%' },
      { label: 'Logo Churn', value: `${metrics.logoChurnRate.toFixed(1)}%/mo`, benchmark: '<1.5%' },
    ]
  };
  signals.push(retentionSignal);

  // Expansion Revenue Signal
  const expansionRatio = inputs.expansionARR / (inputs.beginningARR * 1000) * 100;
  const expansionSignal: InvestmentSignal = {
    area: 'Expansion Revenue',
    signal: expansionRatio < 1 && metrics.annualizedNRR < 110 ? 'increase' :
            metrics.annualizedNRR >= 120 ? 'maintain' : 'increase',
    rationale: metrics.annualizedNRR >= 120
      ? 'Strong expansion motion—maintain focus'
      : 'Expansion revenue represents untapped growth potential',
    metrics: [
      { label: 'Expansion ARR', value: `$${inputs.expansionARR.toLocaleString()}K`, benchmark: 'varies' },
      { label: 'Expansion Rate', value: `${expansionRatio.toFixed(1)}%`, benchmark: '>1%/mo' },
      { label: 'ARPA', value: `$${Math.round(metrics.arpa).toLocaleString()}`, benchmark: 'varies' },
    ]
  };
  signals.push(expansionSignal);

  return signals;
}

export default function WhereToInvest({ metrics, inputs }: WhereToInvestProps) {
  const signals = getInvestmentSignals(metrics, inputs);

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">
        Where to Invest
      </h2>

      <div className="space-y-4">
        {signals.map((signal) => (
          <div key={signal.area} className={`border ${
            signal.signal === 'increase' ? 'border-emerald-200' :
            signal.signal === 'reduce' ? 'border-rose-200' :
            'border-slate-200'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              signal.signal === 'increase' ? 'bg-emerald-50 border-emerald-200' :
              signal.signal === 'reduce' ? 'bg-rose-50 border-rose-200' :
              'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-medium text-slate-900">{signal.area}</div>
              <div className={`text-sm font-semibold px-2 py-0.5 ${
                signal.signal === 'increase' ? 'text-emerald-700' :
                signal.signal === 'reduce' ? 'text-rose-700' :
                'text-slate-600'
              }`}>
                {signal.signal === 'increase' ? '↑ Increase' :
                 signal.signal === 'reduce' ? '↓ Reduce' : '→ Maintain'}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-slate-600 mb-4">{signal.rationale}</p>

              {/* Metrics Table */}
              <div className="grid grid-cols-3 gap-4">
                {signal.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium tabular-nums text-slate-900">
                        {metric.value}
                      </span>
                      <span className="text-xs text-slate-400">
                        {metric.benchmark}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
