// utils/timeSeriesData.ts
import { CalculatedMetrics, Inputs } from '../types';

/**
 * Generates mock time series data for metrics
 * Creates 8 weeks of historical data with realistic variations
 */
export function generateTimeSeriesData(
  currentValue: number,
  weeks: number = 8,
  trend: 'up' | 'down' | 'stable' = 'stable',
  volatility: number = 0.1
): number[] {
  const data: number[] = [];
  const trendFactor = trend === 'up' ? 1.15 : trend === 'down' ? 0.85 : 1.0;
  
  // Start from a base value and work forward to current
  let baseValue = currentValue / Math.pow(trendFactor, weeks - 1);
  
  for (let i = 0; i < weeks; i++) {
    // Apply trend
    const trendedValue = baseValue * Math.pow(trendFactor, i);
    
    // Add random variation (±volatility%)
    const variation = (Math.random() * 2 - 1) * volatility;
    const value = trendedValue * (1 + variation);
    
    data.push(Math.max(0, value)); // Ensure non-negative
  }
  
  return data;
}

/**
 * Generates time series data for all key metrics
 */
export function generateAllTimeSeriesData(
  metrics: CalculatedMetrics,
  inputs: Inputs
): Record<string, number[]> {
  return {
    // Acquisition metrics
    paidImpressions: generateTimeSeriesData(inputs.paidImpressions, 8, 'stable', 0.15),
    paidClicks: generateTimeSeriesData(inputs.paidClicks, 8, 'stable', 0.12),
    leadsGenerated: generateTimeSeriesData(inputs.leadsGenerated, 8, 'up', 0.1),
    mqlsGenerated: generateTimeSeriesData(inputs.mqlsGenerated, 8, 'up', 0.1),
    sqlsGenerated: generateTimeSeriesData(metrics.sqlsGenerated, 8, 'up', 0.12),
    opportunitiesCreated: generateTimeSeriesData(metrics.opportunitiesCreated, 8, 'stable', 0.15),
    dealsClosedWon: generateTimeSeriesData(metrics.dealsClosedWon, 8, 'stable', 0.2),
    
    // Revenue metrics
    newBookings: generateTimeSeriesData(metrics.newBookings, 8, 'up', 0.15),
    expansionARR: generateTimeSeriesData(inputs.expansionARR, 8, 'up', 0.1),
    churnedARR: generateTimeSeriesData(inputs.churnedARR, 8, 'stable', 0.2),
    netNewARR: generateTimeSeriesData(metrics.netNewARR, 8, 'up', 0.15),
    endingARR: generateTimeSeriesData(metrics.endingARR * 1000, 8, 'up', 0.08),
    
    // Retention metrics
    annualizedGRR: generateTimeSeriesData(metrics.annualizedGRR, 8, 'stable', 0.02),
    annualizedNRR: generateTimeSeriesData(metrics.annualizedNRR, 8, 'stable', 0.03),
    logoChurnRate: generateTimeSeriesData(metrics.logoChurnRate, 8, 'stable', 0.15),
    
    // Efficiency metrics
    ctr: generateTimeSeriesData(metrics.ctr, 8, 'stable', 0.1),
    cacBlended: generateTimeSeriesData(metrics.cacBlended * 1000, 8, 'stable', 0.1),
    ltv: generateTimeSeriesData(metrics.ltv, 8, 'stable', 0.05),
    ltvCacRatio: generateTimeSeriesData(metrics.ltvCacRatio, 8, 'stable', 0.08),
    magicNumber: generateTimeSeriesData(metrics.magicNumber, 8, 'stable', 0.12),
    
    // Financial metrics
    grossMargin: generateTimeSeriesData(metrics.grossMargin, 8, 'stable', 0.02),
    ebitdaMargin: generateTimeSeriesData(metrics.ebitdaMargin, 8, 'up', 0.1),
    ruleOf40: generateTimeSeriesData(metrics.ruleOf40, 8, 'up', 0.08),
    saasQuickRatio: generateTimeSeriesData(metrics.saasQuickRatio, 8, 'stable', 0.1),
  };
}

/**
 * Calculates week-over-week change percentage
 */
export function calculateWoWChange(data: number[]): number | null {
  if (!data || data.length < 2) {
    return null;
  }
  
  const current = data[data.length - 1];
  const previous = data[data.length - 2];
  
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  
  return ((current - previous) / previous) * 100;
}

/**
 * Gets the trend direction from time series data
 */
export function getTrendDirection(data: number[]): 'up' | 'down' | 'stable' {
  if (!data || data.length < 2) {
    return 'stable';
  }
  
  const recent = data.slice(-3); // Last 3 weeks
  const first = recent[0];
  const last = recent[recent.length - 1];
  
  const change = ((last - first) / first) * 100;
  
  if (change > 2) return 'up';
  if (change < -2) return 'down';
  return 'stable';
}

