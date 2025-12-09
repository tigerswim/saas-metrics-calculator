// types.ts
export interface Inputs {
  beginningARR: number;
  totalCustomers: number;
  newBookings: number;
  expansionARR: number;
  churnedARR: number;
  customersChurned: number;
  newCustomersAdded: number;
  leadsGenerated: number;
  mqlsGenerated: number;
  mqlToSQLConversion: number;
  sqlToOppConversion: number;
  winRate: number;
  avgDealSize: number;
  salesCycle: number;
  totalMarketingSpend: number;
  paidMarketingSpend: number;
  paidImpressions: number;
  paidClicks: number;
  totalSalesMarketing: number;
  rdSpend: number;
  gaSpend: number;
  cogsPercent: number;
  avgCustomerLifetime: number;
}

export interface CalculatedMetrics {
  // ARR & Growth
  netNewARR: number;
  endingARR: number;
  mrr: number;
  monthlyRevenue: number;
  arrGrowthRateMonthly: number;
  annualizedGrowthRate: number;

  // Retention
  grr: number;
  nrr: number;
  annualizedGRR: number;
  annualizedNRR: number;
  logoChurnRate: number;
  endingCustomerCount: number;

  // Pipeline
  sqlsGenerated: number;
  opportunitiesCreated: number;
  dealsClosedWon: number;
  pipelineGenerated: number;
  pipelineConversion: number;
  pipelineVelocity: number;

  // Marketing Efficiency
  cacBlended: number;
  cacPaidOnly: number;
  ltv: number;
  ltvCacRatio: number;
  cacPaybackPeriod: number;
  costPerMQL: number;
  costPerSQL: number;
  cpm: number;
  cpc: number;
  ctr: number;

  // Sales Efficiency
  magicNumber: number;
  paybackPeriodSM: number;

  // Financial Performance
  grossProfit: number;
  grossMargin: number;
  totalOpEx: number;
  ebitda: number;
  ebitdaMargin: number;
  ruleOf40: number;
  saasQuickRatio: number;
  burnMultiple: number;

  // Helper metrics
  arpa: number;
}

export interface KeyMetric {
  name: string;
  value: string | number;
  target: string;
  status: 'good' | 'warning' | 'bad';
  tooltip?: string;
}