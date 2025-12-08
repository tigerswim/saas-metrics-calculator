'use client';

import { CalculatedMetrics, Inputs } from '../types';

interface ExecutiveBriefProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

function generateNarrative(metrics: CalculatedMetrics, inputs: Inputs): string[] {
  const narratives: string[] = [];

  // Growth narrative
  const growthRate = metrics.annualizedGrowthRate;
  if (growthRate >= 40) {
    narratives.push(`The business is growing at ${growthRate.toFixed(0)}% annually, well above the 20% threshold for healthy SaaS growth.`);
  } else if (growthRate >= 20) {
    narratives.push(`Annual growth of ${growthRate.toFixed(0)}% indicates solid momentum, though acceleration opportunities should be explored.`);
  } else {
    narratives.push(`Growth at ${growthRate.toFixed(0)}% annually signals a need to reassess go-to-market strategy or product-market fit.`);
  }

  // Efficiency narrative
  const magicNumber = metrics.magicNumber;
  if (magicNumber >= 1.0) {
    narratives.push(`Sales efficiency is strong with a Magic Number of ${magicNumber.toFixed(2)}x—each dollar of S&M spend generates over a dollar of new ARR.`);
  } else if (magicNumber >= 0.75) {
    narratives.push(`S&M efficiency is acceptable at ${magicNumber.toFixed(2)}x, but optimizing CAC or improving conversion rates would strengthen unit economics.`);
  } else {
    narratives.push(`The Magic Number of ${magicNumber.toFixed(2)}x suggests inefficient customer acquisition—review channel mix and sales productivity.`);
  }

  // Retention narrative
  const nrr = metrics.annualizedNRR;
  if (nrr >= 120) {
    narratives.push(`Net retention of ${nrr.toFixed(0)}% demonstrates exceptional expansion revenue and customer success.`);
  } else if (nrr >= 100) {
    narratives.push(`Net retention at ${nrr.toFixed(0)}% shows the customer base is stable, though expansion opportunities remain untapped.`);
  } else {
    narratives.push(`Net retention below 100% (${nrr.toFixed(0)}%) means the business is shrinking within its existing customer base—prioritize churn reduction.`);
  }

  return narratives;
}

function getKeyInsight(metrics: CalculatedMetrics): { label: string; insight: string } {
  // Identify the most critical issue or highlight
  if (metrics.ltvCacRatio < 2) {
    return {
      label: 'Primary Concern',
      insight: `LTV:CAC of ${metrics.ltvCacRatio.toFixed(1)}x is below sustainable levels. Each customer costs more to acquire than they're worth.`
    };
  }
  if (metrics.annualizedGRR < 80) {
    return {
      label: 'Primary Concern',
      insight: `Gross retention at ${metrics.annualizedGRR.toFixed(0)}% indicates a significant churn problem that will compound over time.`
    };
  }
  if (metrics.cacPaybackPeriod > 24) {
    return {
      label: 'Watch Closely',
      insight: `CAC payback of ${metrics.cacPaybackPeriod.toFixed(0)} months ties up capital too long. Consider improving pricing or reducing acquisition costs.`
    };
  }
  if (metrics.ruleOf40 >= 50) {
    return {
      label: 'Strength',
      insight: `Rule of 40 at ${metrics.ruleOf40.toFixed(0)}% reflects strong balance between growth and profitability—a sign of operational discipline.`
    };
  }
  if (metrics.annualizedNRR >= 120) {
    return {
      label: 'Strength',
      insight: `Net retention of ${metrics.annualizedNRR.toFixed(0)}% means the customer base grows itself—a powerful compounding advantage.`
    };
  }
  return {
    label: 'Status',
    insight: 'Core metrics are within acceptable ranges. Focus on maintaining efficiency while pursuing growth opportunities.'
  };
}

export default function ExecutiveBrief({ metrics, inputs }: ExecutiveBriefProps) {
  const narratives = generateNarrative(metrics, inputs);
  const keyInsight = getKeyInsight(metrics);

  const formatCurrency = (value: number, decimals = 1) => {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(decimals)}B`;
    }
    return `$${value.toFixed(decimals)}M`;
  };

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Performance Brief
          </h1>
          <p className="text-slate-500 mt-1">Monthly intelligence summary</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tracking-tight tabular-nums text-blue-600">
            {formatCurrency(metrics.endingARR)}
          </div>
          <div className="text-sm text-slate-500">Ending ARR</div>
        </div>
      </div>

      {/* Key Numbers Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 py-4 border-y border-slate-200 mb-6">
        <div>
          <div className={`text-2xl font-semibold tracking-tight tabular-nums ${
            metrics.netNewARR >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {metrics.netNewARR >= 0 ? '+' : ''}{formatCurrency(metrics.netNewARR / 1000, 1)}
          </div>
          <div className="text-sm text-slate-500">Net New ARR</div>
        </div>
        <div>
          <div className={`text-2xl font-semibold tracking-tight tabular-nums ${
            metrics.annualizedGrowthRate >= 20 ? 'text-blue-600' : 'text-slate-900'
          }`}>
            {metrics.annualizedGrowthRate.toFixed(0)}%
          </div>
          <div className="text-sm text-slate-500">Annual Growth</div>
        </div>
        <div>
          <div className={`text-2xl font-semibold tracking-tight tabular-nums ${
            metrics.annualizedNRR >= 100 ? 'text-blue-600' : 'text-amber-600'
          }`}>
            {metrics.annualizedNRR.toFixed(0)}%
          </div>
          <div className="text-sm text-slate-500">Net Retention</div>
        </div>
        <div>
          <div className={`text-2xl font-semibold tracking-tight tabular-nums ${
            metrics.ruleOf40 >= 40 ? 'text-blue-600' : 'text-slate-900'
          }`}>
            {metrics.ruleOf40.toFixed(0)}%
          </div>
          <div className="text-sm text-slate-500">Rule of 40</div>
        </div>
      </div>

      {/* Narrative */}
      <div className="space-y-3 mb-6">
        {narratives.map((narrative, index) => (
          <p key={index} className="text-slate-700 leading-relaxed">
            {narrative}
          </p>
        ))}
      </div>

      {/* Key Insight */}
      <div className={`pl-4 py-3 border-l-2 ${
        keyInsight.label === 'Strength'
          ? 'bg-emerald-50 border-emerald-500'
          : keyInsight.label === 'Primary Concern'
            ? 'bg-rose-50 border-rose-500'
            : keyInsight.label === 'Watch Closely'
              ? 'bg-amber-50 border-amber-500'
              : 'bg-slate-50 border-blue-500'
      }`}>
        <div className={`text-xs font-medium uppercase tracking-wide mb-1 ${
          keyInsight.label === 'Strength'
            ? 'text-emerald-600'
            : keyInsight.label === 'Primary Concern'
              ? 'text-rose-600'
              : keyInsight.label === 'Watch Closely'
                ? 'text-amber-600'
                : 'text-blue-600'
        }`}>
          {keyInsight.label}
        </div>
        <p className="text-slate-900 font-medium">
          {keyInsight.insight}
        </p>
      </div>
    </section>
  );
}
