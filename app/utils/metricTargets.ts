// Metric target thresholds and status evaluation

import { CalculatedMetrics, Inputs } from '../types';

export type MetricStatus = 'good' | 'warning' | 'bad' | 'neutral';

interface MetricTarget {
  good: (value: number) => boolean;
  warning: (value: number) => boolean;
  // If not good or warning, it's bad
  targetLabel?: string; // Human-readable target description
}

// Define targets for key metrics
const metricTargets: Record<string, MetricTarget> = {
  // Efficiency Metrics - Lower is better
  'cost-per-mql': {
    good: (v) => v < 100,
    warning: (v) => v >= 100 && v < 200,
    targetLabel: '< $100',
  },
  'cost-per-sql': {
    good: (v) => v < 200,
    warning: (v) => v >= 200 && v < 400,
    targetLabel: '< $200',
  },
  'cost-per-opp': {
    good: (v) => v < 500,
    warning: (v) => v >= 500 && v < 1000,
    targetLabel: '< $500',
  },
  'cost-per-won': {
    good: (v) => v < 2000,
    warning: (v) => v >= 2000 && v < 5000,
    targetLabel: '< $2,000',
  },
  'cac-blended': {
    good: (v) => v < 5000,
    warning: (v) => v >= 5000 && v < 10000,
    targetLabel: '< $5,000',
  },
  'cac-payback-period': {
    good: (v) => v < 12,
    warning: (v) => v >= 12 && v < 18,
    targetLabel: '< 12 months',
  },
  'burn-multiple': {
    good: (v) => v < 1.5,
    warning: (v) => v >= 1.5 && v < 3,
    targetLabel: '< 1.5x',
  },

  // Unit Economics - Higher is better
  'ltv-cac-ratio': {
    good: (v) => v > 3,
    warning: (v) => v >= 2 && v <= 3,
    targetLabel: '> 3:1',
  },
  'ltv': {
    good: (v) => v > 30000,
    warning: (v) => v >= 20000 && v <= 30000,
    targetLabel: '> $30,000',
  },

  // Growth & Efficiency - Higher is better
  'magic-number': {
    good: (v) => v > 0.75,
    warning: (v) => v >= 0.5 && v <= 0.75,
    targetLabel: '> 0.75x',
  },
  'quick-ratio': {
    good: (v) => v > 4,
    warning: (v) => v >= 2 && v <= 4,
    targetLabel: '> 4x',
  },
  'rule-of-40': {
    good: (v) => v > 40,
    warning: (v) => v >= 20 && v <= 40,
    targetLabel: '> 40%',
  },

  // Retention - Higher is better
  'annualized-grr': {
    good: (v) => v > 95,
    warning: (v) => v >= 85 && v <= 95,
    targetLabel: '> 95%',
  },
  'annualized-nrr': {
    good: (v) => v > 120,
    warning: (v) => v >= 100 && v <= 120,
    targetLabel: '> 120%',
  },
  'logo-churn-rate': {
    good: (v) => v < 2,
    warning: (v) => v >= 2 && v < 5,
    targetLabel: '< 2%',
  },

  // Growth Rate - Higher is better
  'arr-growth-rate': {
    good: (v) => v > 40,
    warning: (v) => v >= 20 && v <= 40,
    targetLabel: '> 40%',
  },

  // Margins - Higher is better
  'gross-margin': {
    good: (v) => v > 80,
    warning: (v) => v >= 70 && v <= 80,
    targetLabel: '> 80%',
  },
  'ebitda-margin': {
    good: (v) => v > 20,
    warning: (v) => v >= 0 && v <= 20,
    targetLabel: '> 20%',
  },

  // Paid Media Efficiency - Lower is better
  'cpm': {
    good: (v) => v < 10,
    warning: (v) => v >= 10 && v < 20,
    targetLabel: '< $10.00',
  },
  'cpc': {
    good: (v) => v < 2,
    warning: (v) => v >= 2 && v < 5,
    targetLabel: '< $2.00',
  },

  // Conversion Rates - Higher is better (percentages)
  'ctr': {
    good: (v) => v > 2,
    warning: (v) => v >= 1 && v <= 2,
    targetLabel: '> 2%',
  },
  'click-to-lead-rate': {
    good: (v) => v > 5,
    warning: (v) => v >= 2 && v <= 5,
    targetLabel: '> 5%',
  },
  'lead-to-mql-rate': {
    good: (v) => v > 30,
    warning: (v) => v >= 20 && v <= 30,
    targetLabel: '> 30%',
  },
};

/**
 * Evaluate metric status based on targets
 */
export function getMetricStatus(metricId: string, value: number): MetricStatus {
  const target = metricTargets[metricId];

  if (!target) {
    return 'neutral'; // No target defined
  }

  if (target.good(value)) {
    return 'good';
  } else if (target.warning(value)) {
    return 'warning';
  } else {
    return 'bad';
  }
}

/**
 * Get target label for a metric
 */
export function getMetricTargetLabel(metricId: string): string | null {
  const target = metricTargets[metricId];
  return target?.targetLabel || null;
}

/**
 * Get status for a metric from calculated metrics
 */
export function getCalculatedMetricStatus(
  metricId: string,
  metrics: CalculatedMetrics,
  inputs?: Inputs
): MetricStatus {
  const metricValueMap: Record<string, number> = {
    'cost-per-mql': metrics.costPerMQL,
    'cost-per-sql': metrics.costPerSQL,
    'cost-per-opp': metrics.costPerOpp,
    'cost-per-won': metrics.costPerWon,
    'cac-blended': metrics.cacBlended,
    'cac-payback-period': metrics.cacPaybackPeriod,
    'burn-multiple': metrics.burnMultiple,
    'ltv-cac-ratio': metrics.ltvCacRatio,
    'ltv': metrics.ltv,
    'magic-number': metrics.magicNumber,
    'quick-ratio': metrics.saasQuickRatio,
    'rule-of-40': metrics.ruleOf40,
    'annualized-grr': metrics.annualizedGRR,
    'annualized-nrr': metrics.annualizedNRR,
    'logo-churn-rate': metrics.logoChurnRate,
    'arr-growth-rate': metrics.annualizedGrowthRate,
    'gross-margin': metrics.grossMargin,
    'ebitda-margin': metrics.ebitdaMargin,
    'cpm': metrics.cpm,
    'cpc': metrics.cpc,
    'ctr': metrics.ctr,
    'click-to-lead-rate': metrics.clickToLeadRate,
    'lead-to-mql-rate': metrics.leadToMQLRate,
  };

  const value = metricValueMap[metricId];

  if (value === undefined) {
    return 'neutral';
  }

  return getMetricStatus(metricId, value);
}
