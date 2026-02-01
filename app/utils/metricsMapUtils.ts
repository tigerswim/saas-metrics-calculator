// utils/metricsMapUtils.ts
import { CalculatedMetrics, Inputs } from '../types';

export type MetricStatus = 'good' | 'warning' | 'bad';

export interface MetricConnection {
  metricKey: string;
  relationship: 'upstream' | 'downstream';
  connectionType: 'direct' | 'calculated';
  formula?: string;
}

export interface MetricNode {
  id: string;
  label: string;
  value: number | string;
  formattedValue: string;
  status: MetricStatus;
  category: 'acquisition' | 'pipeline' | 'revenue' | 'retention' | 'unit-economics' | 'financial';
  position?: { x: number; y: number };
  connections?: MetricConnection[];
}

/**
 * Determines status color for a metric based on thresholds
 */
export function getMetricStatus(
  metricKey: string,
  value: number,
  metrics: CalculatedMetrics,
  inputs: Inputs
): MetricStatus {
  switch (metricKey) {
    case 'annualizedGrowthRate':
      return value >= 20 ? 'good' : value >= 10 ? 'warning' : 'bad';
    case 'annualizedGRR':
      return value >= 90 ? 'good' : value >= 80 ? 'warning' : 'bad';
    case 'annualizedNRR':
      return value >= 110 ? 'good' : value >= 100 ? 'warning' : 'bad';
    case 'ltvCacRatio':
      return value >= 3 ? 'good' : value >= 2 ? 'warning' : 'bad';
    case 'cacPaybackPeriod':
      return value <= 12 ? 'good' : value <= 18 ? 'warning' : 'bad';
    case 'ruleOf40':
      return value >= 40 ? 'good' : value >= 25 ? 'warning' : 'bad';
    case 'magicNumber':
      return value >= 1.0 ? 'good' : value >= 0.75 ? 'warning' : 'bad';
    case 'logoChurnRate':
      return value <= 1.5 ? 'good' : value <= 3 ? 'warning' : 'bad';
    case 'grossMargin':
      return value >= 75 ? 'good' : value >= 65 ? 'warning' : 'bad';
    case 'saasQuickRatio':
      return value >= 4 ? 'good' : value >= 2 ? 'warning' : 'bad';
    case 'ctr':
      return value >= 2 ? 'good' : value >= 1 ? 'warning' : 'bad';
    case 'pipelineConversion':
      return value >= 5 ? 'good' : value >= 2 ? 'warning' : 'bad';
    default:
      return 'good';
  }
}

/**
 * Returns upstream/downstream relationships for any metric
 */
export function getMetricConnections(metricKey: string): MetricConnection[] {
  const connections: Record<string, MetricConnection[]> = {
    // Acquisition Flow
    paidImpressions: [
      { metricKey: 'paidClicks', relationship: 'downstream', connectionType: 'calculated', formula: 'via CTR' },
    ],
    paidClicks: [
      { metricKey: 'paidImpressions', relationship: 'upstream', connectionType: 'calculated', formula: 'via CTR' },
      { metricKey: 'leadsGenerated', relationship: 'downstream', connectionType: 'direct' },
    ],
    leadsGenerated: [
      { metricKey: 'paidClicks', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'mqlsGenerated', relationship: 'downstream', connectionType: 'calculated', formula: 'via Lead→MQL rate' },
    ],
    mqlsGenerated: [
      { metricKey: 'leadsGenerated', relationship: 'upstream', connectionType: 'calculated', formula: 'via Lead→MQL rate' },
      { metricKey: 'sqlsGenerated', relationship: 'downstream', connectionType: 'calculated', formula: 'via MQL→SQL conversion' },
    ],
    sqlsGenerated: [
      { metricKey: 'mqlsGenerated', relationship: 'upstream', connectionType: 'calculated', formula: 'via MQL→SQL conversion' },
      { metricKey: 'opportunitiesCreated', relationship: 'downstream', connectionType: 'calculated', formula: 'via SQL→Opp conversion' },
    ],
    opportunitiesCreated: [
      { metricKey: 'sqlsGenerated', relationship: 'upstream', connectionType: 'calculated', formula: 'via SQL→Opp conversion' },
      { metricKey: 'dealsClosedWon', relationship: 'downstream', connectionType: 'calculated', formula: 'via Win Rate' },
    ],
    dealsClosedWon: [
      { metricKey: 'opportunitiesCreated', relationship: 'upstream', connectionType: 'calculated', formula: 'via Win Rate' },
      { metricKey: 'newCustomersAdded', relationship: 'downstream', connectionType: 'direct' },
    ],
    newCustomersAdded: [
      { metricKey: 'dealsClosedWon', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'newBookings', relationship: 'downstream', connectionType: 'calculated', formula: '× Avg Deal Size' },
    ],
    newBookings: [
      { metricKey: 'newCustomersAdded', relationship: 'upstream', connectionType: 'calculated', formula: '× Avg Deal Size' },
      { metricKey: 'netNewARR', relationship: 'downstream', connectionType: 'direct' },
    ],
    // Revenue Flow
    netNewARR: [
      { metricKey: 'newBookings', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'expansionARR', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'churnedARR', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'endingARR', relationship: 'downstream', connectionType: 'direct' },
    ],
    endingARR: [
      { metricKey: 'netNewARR', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'beginningARR', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'mrr', relationship: 'downstream', connectionType: 'calculated', formula: '÷ 12' },
    ],
    // Unit Economics
    cacBlended: [
      { metricKey: 'totalSalesMarketing', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'newCustomersAdded', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'ltvCacRatio', relationship: 'downstream', connectionType: 'calculated', formula: 'with LTV' },
    ],
    ltv: [
      { metricKey: 'arpa', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'avgCustomerLifetime', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'ltvCacRatio', relationship: 'downstream', connectionType: 'calculated', formula: 'with CAC' },
    ],
    ltvCacRatio: [
      { metricKey: 'ltv', relationship: 'upstream', connectionType: 'calculated', formula: '÷ CAC' },
      { metricKey: 'cacBlended', relationship: 'upstream', connectionType: 'calculated', formula: '÷ LTV' },
    ],
    // Financial
    ruleOf40: [
      { metricKey: 'annualizedGrowthRate', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'ebitdaMargin', relationship: 'upstream', connectionType: 'direct' },
    ],
    magicNumber: [
      { metricKey: 'netNewARR', relationship: 'upstream', connectionType: 'direct' },
      { metricKey: 'totalSalesMarketing', relationship: 'upstream', connectionType: 'direct' },
    ],
  };

  return connections[metricKey] || [];
}

/**
 * Calculates conversion rate between two connected metrics
 */
export function getConversionRate(
  fromMetric: string,
  toMetric: string,
  metrics: CalculatedMetrics,
  inputs: Inputs
): number | null {
  // Lead to MQL
  if (fromMetric === 'leadsGenerated' && toMetric === 'mqlsGenerated') {
    return inputs.leadsGenerated > 0 ? (inputs.mqlsGenerated / inputs.leadsGenerated) * 100 : 0;
  }
  // MQL to SQL
  if (fromMetric === 'mqlsGenerated' && toMetric === 'sqlsGenerated') {
    return inputs.mqlToSQLConversion;
  }
  // SQL to Opp
  if (fromMetric === 'sqlsGenerated' && toMetric === 'opportunitiesCreated') {
    return inputs.sqlToOppConversion;
  }
  // Opp to Won
  if (fromMetric === 'opportunitiesCreated' && toMetric === 'dealsClosedWon') {
    return inputs.winRate;
  }
  // Impressions to Clicks (CTR)
  if (fromMetric === 'paidImpressions' && toMetric === 'paidClicks') {
    return metrics.ctr;
  }
  // Overall pipeline conversion
  if (fromMetric === 'mqlsGenerated' && toMetric === 'dealsClosedWon') {
    return metrics.pipelineConversion;
  }

  return null;
}

/**
 * Formats metric values for display
 */
export function formatMetricValue(
  metricKey: string,
  value: number,
  metrics: CalculatedMetrics,
  inputs: Inputs
): string {
  switch (metricKey) {
    case 'endingARR':
    case 'beginningARR':
    case 'mrr':
      return `$${(value / 1000).toFixed(1)}M`;
    case 'netNewARR':
    case 'newBookings':
    case 'expansionARR':
    case 'churnedARR':
      // Convert to M if > 1000K
      if (value > 1000) {
        return `$${(value / 1000).toFixed(1)}M`;
      }
      return `$${Math.round(value).toLocaleString()}K`;
    case 'monthlyRevenue':
    case 'grossProfit':
    case 'totalOpEx':
    case 'ebitda':
      return `$${value.toFixed(0)}K`;
    case 'cacBlended':
    case 'cacPaidOnly':
      return `$${Math.round(value * 1000).toLocaleString()}`;
    case 'costPerLead':
    case 'costPerMQL':
    case 'costPerSQL':
    case 'cpc':
      return `$${Math.round(value).toLocaleString()}`;
    case 'ltv':
      return `$${Math.round(value).toLocaleString()}`;
    case 'cpm':
      return `$${value.toFixed(2)}`;
    case 'pipelineGenerated':
      return `$${(value / 1000).toFixed(1)}M`;
    case 'pipelineVelocity':
      return `$${Math.round(value / 1000).toLocaleString()}K/day`;
    case 'annualizedGrowthRate':
    case 'arrGrowthRateMonthly':
    case 'annualizedGRR':
    case 'annualizedNRR':
    case 'grr':
    case 'nrr':
    case 'logoChurnRate':
    case 'grossMargin':
    case 'ebitdaMargin':
    case 'ruleOf40':
    case 'ctr':
    case 'pipelineConversion':
      return `${value.toFixed(1)}%`;
    case 'ltvCacRatio':
    case 'magicNumber':
    case 'saasQuickRatio':
      return `${value.toFixed(1)}x`;
    case 'cacPaybackPeriod':
    case 'paybackPeriodSM':
    case 'salesCycle':
      return `${value.toFixed(1)} mo`;
    case 'avgDealSize':
      return `$${value}K`;
    default:
      return value.toLocaleString();
  }
}

/**
 * Gets the display label for a metric
 */
export function getMetricLabel(metricKey: string): string {
  const labels: Record<string, string> = {
    paidImpressions: 'Impressions',
    paidClicks: 'Clicks',
    leadsGenerated: 'Leads',
    mqlsGenerated: 'MQLs',
    sqlsGenerated: 'SQLs',
    opportunitiesCreated: 'Opportunities',
    dealsClosedWon: 'Deals Won',
    newCustomersAdded: 'New Customers',
    newBookings: 'New Bookings',
    beginningARR: 'Beginning ARR',
    expansionARR: 'Expansion ARR',
    churnedARR: 'Churned ARR',
    netNewARR: 'Net New ARR',
    endingARR: 'Ending ARR',
    mrr: 'MRR',
    monthlyRevenue: 'Monthly Revenue',
    annualizedGrowthRate: 'ARR Growth',
    annualizedGRR: 'GRR',
    annualizedNRR: 'NRR',
    grr: 'GRR (Monthly)',
    nrr: 'NRR (Monthly)',
    logoChurnRate: 'Logo Churn',
    cacBlended: 'CAC (Blended)',
    cacPaidOnly: 'CAC (Paid)',
    ltv: 'LTV',
    ltvCacRatio: 'LTV:CAC',
    cacPaybackPeriod: 'CAC Payback',
    costPerMQL: 'Cost/MQL',
    costPerSQL: 'Cost/SQL',
    cpm: 'CPM',
    cpc: 'CPC',
    ctr: 'CTR',
    magicNumber: 'Magic Number',
    paybackPeriodSM: 'S&M Payback',
    grossProfit: 'Gross Profit',
    grossMargin: 'Gross Margin',
    totalOpEx: 'Total OpEx',
    ebitda: 'EBITDA',
    ebitdaMargin: 'EBITDA Margin',
    ruleOf40: 'Rule of 40',
    saasQuickRatio: 'Quick Ratio',
    burnMultiple: 'Burn Multiple',
    pipelineGenerated: 'Pipeline',
    pipelineVelocity: 'Pipeline Velocity',
    pipelineConversion: 'Pipeline Conv.',
    arpa: 'ARPA',
    avgDealSize: 'Avg Deal Size',
    salesCycle: 'Sales Cycle',
    totalSalesMarketing: 'S&M Spend',
  };

  return labels[metricKey] || metricKey;
}

