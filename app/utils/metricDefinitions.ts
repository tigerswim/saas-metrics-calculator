// Comprehensive metric definitions with formulas and descriptions

export interface MetricDefinition {
  formula: string;
  description: string;
  impact: string;
}

export const metricDefinitions: Record<string, MetricDefinition> = {
  // ARR & Growth Metrics
  'Net New ARR': {
    formula: 'New Bookings + Expansion ARR - Churned ARR',
    description: 'The net change in Annual Recurring Revenue during the period, combining all new business, upsells, and losses.',
    impact: 'Shows your company\'s true growth trajectory. Positive net new ARR means you\'re growing; negative means contraction.',
  },
  'Ending ARR': {
    formula: 'Beginning ARR + Net New ARR',
    description: 'Total Annual Recurring Revenue at the end of the period.',
    impact: 'Your primary growth metric - the annualized value of all recurring revenue streams.',
  },
  'ARR Growth': {
    formula: '((1 + Monthly Growth Rate) ^ 12) - 1',
    description: 'The compounded annual growth rate of your ARR.',
    impact: 'Key metric for investors. 20%+ is good for mature companies; 40%+ is excellent.',
  },

  // Retention Metrics
  'GRR': {
    formula: '((Starting ARR - Churned ARR) / Starting ARR) ^ 12',
    description: 'Gross Revenue Retention measures the percentage of revenue retained from existing customers, excluding expansions.',
    impact: 'Shows how well you retain base revenue. >90% is healthy; >95% is excellent. Low GRR indicates product or service issues.',
  },
  'NRR': {
    formula: '((Starting ARR - Churned ARR + Expansion ARR) / Starting ARR) ^ 12',
    description: 'Net Revenue Retention measures revenue retained plus expansion from existing customers.',
    impact: '>100% means you\'re growing within your base (negative churn). >110% is world-class. >120% is exceptional.',
  },
  'Logo Churn': {
    formula: '(Customers Churned / Total Customers) × 100',
    description: 'The percentage of customers who cancel each month.',
    impact: '<1.5% monthly is good for enterprise; <3% acceptable for SMB. High churn indicates product-market fit issues.',
  },

  // Unit Economics
  'LTV:CAC': {
    formula: '(ARPA × Customer Lifetime) / CAC',
    description: 'The ratio of customer lifetime value to customer acquisition cost.',
    impact: '>3.0x means healthy unit economics. <2x suggests unprofitable customer acquisition. Aim for 3-5x.',
  },
  'CAC Payback': {
    formula: 'CAC / (ARPA × Gross Margin %)',
    description: 'Months needed to recover the cost of acquiring a customer.',
    impact: '<12 months is excellent; <18 months is good. Longer payback requires more capital to grow.',
  },
  'CAC Blended': {
    formula: 'Total S&M Spend / New Customers Added',
    description: 'Average cost to acquire a customer including all sales and marketing expenses.',
    impact: 'Measures total acquisition efficiency. Compare to LTV to ensure profitable growth.',
  },
  'LTV': {
    formula: 'ARPA × Customer Lifetime (months)',
    description: 'Total revenue expected from a customer over their lifetime.',
    impact: 'Must be significantly higher than CAC (3-5x) for sustainable growth.',
  },
  'ARPA': {
    formula: 'Total ARR / Total Customers / 12',
    description: 'Average Revenue Per Account (monthly).',
    impact: 'Higher ARPA generally means better unit economics and easier path to profitability.',
  },

  // Pipeline & Marketing
  'Cost per MQL': {
    formula: 'Total Marketing Spend / MQLs Generated',
    description: 'Average cost to generate a Marketing Qualified Lead.',
    impact: 'Measures top-of-funnel efficiency. Track trends to optimize marketing spend.',
  },
  'Cost per SQL': {
    formula: 'Total Marketing Spend / SQLs Generated',
    description: 'Average cost to generate a Sales Qualified Lead.',
    impact: 'More important than MQL cost - measures quality of lead qualification.',
  },
  'Pipeline Conversion': {
    formula: '(Deals Won / MQLs Generated) × 100',
    description: 'Percentage of MQLs that eventually become customers.',
    impact: 'End-to-end funnel efficiency. Improving this amplifies all marketing efforts.',
  },
  'Pipeline Velocity': {
    formula: 'Pipeline Value / (Sales Cycle Days × 30)',
    description: 'Dollar value of pipeline created per day.',
    impact: 'Measures sales team productivity. Higher velocity means faster revenue growth.',
  },

  // Sales Efficiency
  'Magic Number': {
    formula: 'Net New ARR / Total S&M Spend',
    description: 'Measures sales and marketing efficiency - revenue generated per dollar spent.',
    impact: '>0.75 is efficient; >1.0 is very efficient. <0.5 suggests overspending on growth.',
  },
  'Magic #': {
    formula: 'Net New ARR / Total S&M Spend',
    description: 'Measures sales and marketing efficiency - revenue generated per dollar spent.',
    impact: '>0.75 is efficient; >1.0 is very efficient. <0.5 suggests overspending on growth.',
  },
  'Quick Ratio': {
    formula: '(New Bookings + Expansion ARR) / Churned ARR',
    description: 'Growth efficiency ratio comparing revenue gains to losses.',
    impact: '>4.0 is healthy growth; <1.0 means you\'re shrinking. Measures overall business health.',
  },

  // Financial Performance
  'Gross Margin': {
    formula: '(Revenue - COGS) / Revenue × 100',
    description: 'Percentage of revenue remaining after direct costs.',
    impact: '>75% is typical for SaaS; >80% is excellent. Higher margins mean better unit economics.',
  },
  'EBITDA Margin': {
    formula: '(Gross Profit - OpEx) / Revenue × 100',
    description: 'Operating profit margin before interest, taxes, depreciation, and amortization.',
    impact: 'Shows path to profitability. Positive EBITDA means you can self-fund growth.',
  },
  'Rule of 40': {
    formula: 'ARR Growth Rate % + EBITDA Margin %',
    description: 'Balances growth and profitability. Key metric for SaaS company health.',
    impact: '>40% is healthy; >50% is excellent. Shows you\'re efficiently balancing growth with profitability.',
  },
  'Burn Multiple': {
    formula: '|Net Burn| / Net New ARR',
    description: 'Capital efficiency - dollars burned to generate each dollar of new ARR.',
    impact: '<1.5x is efficient; <1.0x is excellent. >2.0x suggests inefficient growth spending.',
  },

  // Paid Marketing
  'CPM': {
    formula: '(Paid Marketing Spend / Impressions) × 1000',
    description: 'Cost per thousand impressions in paid advertising.',
    impact: 'Measures ad reach efficiency. Compare across channels to optimize spend.',
  },
  'CPC': {
    formula: 'Paid Marketing Spend / Clicks',
    description: 'Cost per click in paid advertising campaigns.',
    impact: 'Measures click efficiency. Lower CPC means more traffic for same budget.',
  },
  'CTR': {
    formula: '(Clicks / Impressions) × 100',
    description: 'Click-through rate - percentage of people who click your ads.',
    impact: 'Measures ad relevance. >2% is typically good for B2B SaaS.',
  },
};

// Helper function to get metric definition
export function getMetricDefinition(metricName: string): MetricDefinition | undefined {
  return metricDefinitions[metricName];
}
