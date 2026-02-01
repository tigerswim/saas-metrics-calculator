// Metric formulas and definitions for the relationship panel

export interface MetricFormula {
  formula: string;
  description: string;
  components?: string[];
}

export const metricFormulas: Record<string, MetricFormula> = {
  // Operating Budget
  'sales-marketing-spend': {
    formula: 'Marketing Spend + Sales Spend',
    description: 'Total sales and marketing budget for customer acquisition',
    components: ['marketing-spend', 'sales-spend'],
  },
  'marketing-spend': {
    formula: 'Paid Search + Paid Social + Events + Content + Partnerships + ABM',
    description: 'Total marketing spend across all channels and programs',
    components: ['paid-search', 'paid-social', 'events', 'content', 'partnerships', 'abm'],
  },
  'sales-spend': {
    formula: 'S&M Spend - Marketing Spend',
    description: 'Sales team compensation, tools, and travel',
    components: ['sales-marketing-spend', 'marketing-spend'],
  },
  'rd-spend': {
    formula: 'Monthly R&D Spend',
    description: 'Research and development costs (engineering, product)',
  },
  'ga-spend': {
    formula: 'Monthly G&A Spend',
    description: 'General and administrative expenses (finance, legal, HR, facilities)',
  },

  // Marketing Activities
  'paid-search': {
    formula: 'Monthly Paid Search Spend',
    description: 'Investment in search engine advertising (Google Ads, Bing Ads, etc.)',
  },
  'paid-social': {
    formula: 'Monthly Paid Social Spend',
    description: 'Investment in social media advertising (LinkedIn, Facebook, Twitter, etc.)',
  },
  'events': {
    formula: 'Monthly Events Spend',
    description: 'Investment in conferences, trade shows, webinars, and sponsorships',
  },
  'content': {
    formula: 'Monthly Content Marketing Spend',
    description: 'Investment in content creation, SEO, and organic marketing programs',
  },
  'partnerships': {
    formula: 'Monthly Partnerships Spend',
    description: 'Investment in channel partnerships, co-marketing, and affiliate programs',
  },
  'abm': {
    formula: 'Monthly ABM Spend',
    description: 'Investment in account-based marketing programs and tools',
  },

  // ARR & Growth Metrics
  'new-bookings': {
    formula: 'New Customers Added × Average Deal Size',
    description: 'Total value of new customer contracts signed this period',
    components: ['new-customers-added', 'avg-deal-size'],
  },
  'net-new-arr': {
    formula: 'New Bookings + Expansion ARR - Churned ARR',
    description: 'Net change in Annual Recurring Revenue',
    components: ['new-bookings', 'expansion-arr', 'churned-arr'],
  },
  'ending-arr': {
    formula: 'Beginning ARR + Net New ARR',
    description: 'Total Annual Recurring Revenue at period end',
    components: ['beginning-arr', 'net-new-arr'],
  },
  'mrr': {
    formula: 'Ending ARR ÷ 12',
    description: 'Monthly Recurring Revenue',
    components: ['ending-arr'],
  },
  'arr-growth-rate': {
    formula: '(Net New ARR ÷ Beginning ARR) × 100',
    description: 'Annualized ARR growth rate',
    components: ['net-new-arr', 'beginning-arr'],
  },

  // Retention Metrics
  'grr': {
    formula: '((Beginning ARR - Churned ARR) ÷ Beginning ARR) × 100',
    description: 'Gross Revenue Retention - measures revenue retained from existing customers',
    components: ['beginning-arr', 'churned-arr'],
  },
  'nrr': {
    formula: '((Beginning ARR + Expansion ARR - Churned ARR) ÷ Beginning ARR) × 100',
    description: 'Net Revenue Retention - includes expansion and churn',
    components: ['beginning-arr', 'expansion-arr', 'churned-arr'],
  },
  'annualized-grr': {
    formula: 'Monthly GRR ^ 12',
    description: 'Annualized Gross Revenue Retention',
    components: ['grr'],
  },
  'annualized-nrr': {
    formula: 'Monthly NRR ^ 12',
    description: 'Annualized Net Revenue Retention',
    components: ['nrr'],
  },
  'logo-churn-rate': {
    formula: '(Customers Churned ÷ Beginning Customers) × 100',
    description: 'Percentage of customers lost this period',
    components: ['customers-churned', 'beginning-customers'],
  },
  'ending-customer-count': {
    formula: 'Beginning Customers + New Customers - Churned Customers',
    description: 'Total customer count at period end',
    components: ['beginning-customers', 'new-customers-added', 'customers-churned'],
  },
  'arpa': {
    formula: 'Ending ARR ÷ Ending Customer Count',
    description: 'Average Revenue Per Account',
    components: ['ending-arr', 'ending-customer-count'],
  },

  // Pipeline Metrics
  'sqls': {
    formula: 'MQLs × MQL-to-SQL Conversion Rate',
    description: 'Sales Qualified Leads generated',
    components: ['mqls', 'mql-sql-conversion'],
  },
  'opportunities': {
    formula: 'SQLs × SQL-to-Opp Conversion Rate',
    description: 'Sales opportunities created',
    components: ['sqls', 'sql-opp-conversion'],
  },
  'deals-won': {
    formula: 'Opportunities × Win Rate',
    description: 'Deals closed successfully',
    components: ['opportunities', 'win-rate'],
  },
  'pipeline-generated': {
    formula: 'Opportunities × Average Deal Size',
    description: 'Total pipeline value created',
    components: ['opportunities', 'avg-deal-size'],
  },
  'pipeline-conversion': {
    formula: '(Deals Won ÷ MQLs) × 100',
    description: 'End-to-end conversion rate from MQL to closed deal',
    components: ['deals-won', 'mqls'],
  },
  'pipeline-velocity': {
    formula: '(Opportunities × Avg Deal Size × Win Rate) ÷ Sales Cycle Days',
    description: 'Dollar value of pipeline created per day',
    components: ['opportunities', 'avg-deal-size', 'win-rate', 'sales-cycle'],
  },

  // Marketing Efficiency
  'cac-blended': {
    formula: 'Total S&M Spend ÷ New Customers Added',
    description: 'Customer Acquisition Cost (includes all sales & marketing)',
    components: ['sales-marketing-spend', 'new-customers-added'],
  },
  'cac-paid-only': {
    formula: 'Paid Marketing Spend ÷ New Customers Added',
    description: 'CAC from paid channels only',
    components: ['paid-marketing-spend', 'new-customers-added'],
  },
  'ltv': {
    formula: 'ARPA × Average Customer Lifetime (months)',
    description: 'Lifetime Value of a customer',
    components: ['arpa', 'avg-customer-lifetime'],
  },
  'ltv-cac-ratio': {
    formula: 'LTV ÷ CAC (Blended)',
    description: 'Return on customer acquisition investment',
    components: ['ltv', 'cac-blended'],
  },
  'cac-payback-period': {
    formula: 'CAC ÷ (ARPA × Gross Margin %)',
    description: 'Months to recover customer acquisition cost',
    components: ['cac-blended', 'arpa', 'gross-margin'],
  },
  'cost-per-mql': {
    formula: 'Total Marketing Spend ÷ MQLs Generated',
    description: 'Cost to generate one Marketing Qualified Lead',
    components: ['marketing-spend', 'mqls'],
  },
  'cost-per-sql': {
    formula: 'Total Marketing Spend ÷ SQLs Generated',
    description: 'Cost to generate one Sales Qualified Lead',
    components: ['marketing-spend', 'sqls'],
  },
  'cpm': {
    formula: '(Paid Marketing Spend ÷ Impressions) × 1000',
    description: 'Cost per thousand impressions',
    components: ['paid-marketing-spend', 'impressions'],
  },
  'cpc': {
    formula: 'Paid Marketing Spend ÷ Clicks',
    description: 'Cost per click',
    components: ['paid-marketing-spend', 'clicks'],
  },
  'ctr': {
    formula: '(Clicks ÷ Impressions) × 100',
    description: 'Click-through rate',
    components: ['clicks', 'impressions'],
  },
  'click-to-lead-rate': {
    formula: '(Leads ÷ Clicks) × 100',
    description: 'Percentage of clicks that convert to leads',
    components: ['leads', 'clicks'],
  },
  'lead-to-mql-rate': {
    formula: '(MQLs ÷ Leads) × 100',
    description: 'Percentage of leads that qualify as MQLs',
    components: ['mqls', 'leads'],
  },

  // Sales Efficiency
  'magic-number': {
    formula: 'Net New ARR ÷ S&M Spend',
    description: 'Sales efficiency metric - how much ARR generated per dollar of S&M spend',
    components: ['net-new-arr', 'sales-marketing-spend'],
  },
  'payback-period-sm': {
    formula: 'S&M Spend ÷ Net New ARR × 12',
    description: 'Months to payback S&M investment from new ARR',
    components: ['sales-marketing-spend', 'net-new-arr'],
  },
  'quick-ratio': {
    formula: '(New Bookings + Expansion ARR) ÷ Churned ARR',
    description: 'Rate of revenue growth vs revenue loss',
    components: ['new-bookings', 'expansion-arr', 'churned-arr'],
  },

  // Financial Performance
  'gross-profit': {
    formula: 'Monthly Revenue × (1 - COGS %)',
    description: 'Revenue after cost of goods sold',
    components: ['monthly-revenue', 'cogs-percent'],
  },
  'gross-margin': {
    formula: '(Gross Profit ÷ Monthly Revenue) × 100',
    description: 'Percentage of revenue remaining after COGS',
    components: ['gross-profit', 'monthly-revenue'],
  },
  'total-opex': {
    formula: 'S&M Spend + R&D Spend + G&A Spend',
    description: 'Total operating expenses',
    components: ['sales-marketing-spend', 'rd-spend', 'ga-spend'],
  },
  'ebitda': {
    formula: 'Gross Profit - Total OpEx',
    description: 'Earnings before interest, taxes, depreciation, amortization',
    components: ['gross-profit', 'total-opex'],
  },
  'ebitda-margin': {
    formula: '(EBITDA ÷ Monthly Revenue) × 100',
    description: 'EBITDA as percentage of revenue',
    components: ['ebitda', 'monthly-revenue'],
  },
  'rule-of-40': {
    formula: 'ARR Growth Rate + EBITDA Margin',
    description: 'Sum of growth rate and profitability - benchmark for SaaS health',
    components: ['arr-growth-rate', 'ebitda-margin'],
  },
  'burn-multiple': {
    formula: 'Net Burn ÷ Net New ARR',
    description: 'Capital efficiency - dollars burned per dollar of new ARR',
    components: ['net-burn', 'net-new-arr'],
  },
};

// Get formula for a metric by its ID or label
export function getMetricFormula(metricId: string): MetricFormula | null {
  return metricFormulas[metricId] || null;
}

// Get a human-readable formula with actual values
export function getFormulaWithValues(
  metricId: string,
  inputs: any,
  metrics: any
): string | null {
  const formula = getMetricFormula(metricId);
  if (!formula) return null;

  // This is a simplified version - in production you'd have more sophisticated value substitution
  return formula.formula;
}
