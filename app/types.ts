// types.ts
export interface Inputs {
  beginningARR: number;
  totalCustomers: number;
  // newBookings is now calculated: newCustomersAdded × avgDealSize
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
  // Channel Mix (spend in $K, leads as count)
  paidSearchSpend: number;
  paidSearchLeads: number;
  paidSocialSpend: number;
  paidSocialLeads: number;
  eventsSpend: number;
  eventsLeads: number;
  contentSpend: number;
  contentLeads: number;
  partnershipsSpend: number;
  partnershipsLeads: number;
  // ABM metrics
  targetAccounts: number;
  engagedAccounts: number;
  abmSpend: number;
  // Paid media detail (for CPM/CPC/CTR)
  paidImpressions: number;
  paidClicks: number;
  totalSalesMarketing: number;
  marketingSpend: number;
  rdSpend: number;
  gaSpend: number;
  cogsPercent: number;
  avgCustomerLifetime: number;
}

export interface CalculatedMetrics {
  // ARR & Growth
  newBookings: number; // Calculated: newCustomersAdded × avgDealSize
  netNewARR: number;
  endingARR: number;
  mrr: number;
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
  costPerLead: number;
  costPerMQL: number;
  costPerSQL: number;
  costPerOpp: number;
  costPerWon: number;
  cpm: number;
  cpc: number;
  ctr: number;

  // Conversion rates (for left-side positioning in metrics map)
  clickToLeadRate: number; // (leads / clicks) * 100
  leadToMQLRate: number; // (mqls / leads) * 100

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