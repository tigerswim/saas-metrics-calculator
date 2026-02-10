import { Inputs } from '../types';

export type Industry = 'insurance' | 'banking';

export interface IndustryConfig {
  id: Industry;
  name: string;
  displayName: string;

  // Input field label mappings (40+ fields)
  labelMappings: {
    // Starting Position
    beginningARR: string;
    totalCustomers: string;

    // Monthly Movement
    expansionARR: string;
    churnedARR: string;
    customersChurned: string;
    newCustomersAdded: string;

    // Pipeline Funnel
    leadsGenerated: string;
    mqlsGenerated: string;
    mqlToSQLConversion: string;
    sqlToOppConversion: string;
    winRate: string;
    avgDealSize: string;
    salesCycle: string;

    // Channel Mix
    paidSearchSpend: string;
    paidSearchLeads: string;
    paidSocialSpend: string;
    paidSocialLeads: string;
    eventsSpend: string;
    eventsLeads: string;
    contentSpend: string;
    contentLeads: string;
    partnershipsSpend: string;
    partnershipsLeads: string;

    // ABM
    targetAccounts: string;
    engagedAccounts: string;
    abmSpend: string;

    // Paid Media
    paidImpressions: string;
    paidClicks: string;

    // Operating Expenses
    totalSalesMarketing: string;
    marketingSpend: string;
    rdSpend: string;
    gaSpend: string;

    // Customer Value
    cogsPercent: string;
    avgCustomerLifetime: string;
  };

  // Calculated metric label mappings
  metricLabels: {
    // ARR & Growth
    newBookings: string;
    netNewARR: string;
    endingARR: string;
    mrr: string;
    annualizedGrowthRate: string;

    // Retention
    annualizedGRR: string;
    annualizedNRR: string;
    logoChurnRate: string;

    // Pipeline
    sqlsGenerated: string;
    opportunitiesCreated: string;
    dealsClosedWon: string;
    pipelineGenerated: string;

    // Customer metrics
    arpa: string;
    endingCustomerCount: string;
  };

  // Default input values
  defaultInputs: Inputs;

  // Persona labels (for different stakeholder views)
  personaLabels: {
    ceo: string;
    cfo: string;
    sales: string;
    marketing: string;
  };
}

// Insurance Vertical Configuration (Earnix selling TO insurance companies)
export const insuranceConfig: IndustryConfig = {
  id: 'insurance',
  name: 'Insurance',
  displayName: 'Insurance',

  labelMappings: {
    // Starting Position - Standard SaaS terms
    beginningARR: 'Beginning ARR',
    totalCustomers: 'Total Customers',

    // Monthly Movement - Standard SaaS terms
    expansionARR: 'Expansion ARR',
    churnedARR: 'Churned ARR',
    customersChurned: 'Customers Churned',
    newCustomersAdded: 'New Customers Added',

    // Pipeline Funnel - Standard SaaS terms
    leadsGenerated: 'Leads Generated',
    mqlsGenerated: 'MQLs Generated',
    mqlToSQLConversion: 'MQL to SQL Rate (%)',
    sqlToOppConversion: 'SQL to Opp Rate (%)',
    winRate: 'Win Rate (%)',
    avgDealSize: 'Avg Deal Size',
    salesCycle: 'Sales Cycle (months)',

    // Channel Mix - Standard SaaS terms
    paidSearchSpend: 'Paid Search Spend',
    paidSearchLeads: 'Paid Search Leads',
    paidSocialSpend: 'Paid Social Spend',
    paidSocialLeads: 'Paid Social Leads',
    eventsSpend: 'Events Spend',
    eventsLeads: 'Events Leads',
    contentSpend: 'Content Spend',
    contentLeads: 'Content Leads',
    partnershipsSpend: 'Partnerships Spend',
    partnershipsLeads: 'Partnerships Leads',

    // ABM - Standard SaaS terms
    targetAccounts: 'Target Accounts',
    engagedAccounts: 'Engaged Accounts',
    abmSpend: 'ABM Spend',

    // Paid Media - Standard SaaS terms
    paidImpressions: 'Paid Impressions',
    paidClicks: 'Paid Clicks',

    // Operating Expenses - Standard SaaS terms
    totalSalesMarketing: 'Total Sales & Marketing',
    marketingSpend: 'Marketing Spend',
    rdSpend: 'R&D Spend',
    gaSpend: 'G&A Spend',

    // Customer Value - Standard SaaS terms
    cogsPercent: 'COGS (%)',
    avgCustomerLifetime: 'Avg Customer Lifetime (mo)',
  },

  metricLabels: {
    // ARR & Growth - Standard SaaS terms
    newBookings: 'New Bookings',
    netNewARR: 'Net New ARR',
    endingARR: 'Ending ARR',
    mrr: 'MRR',
    annualizedGrowthRate: 'ARR Growth Rate',

    // Retention - Standard SaaS terms
    annualizedGRR: 'Gross Retention Rate',
    annualizedNRR: 'Net Retention Rate',
    logoChurnRate: 'Logo Churn Rate',

    // Pipeline - Standard SaaS terms
    sqlsGenerated: 'SQLs Generated',
    opportunitiesCreated: 'Opportunities Created',
    dealsClosedWon: 'Deals Closed Won',
    pipelineGenerated: 'Pipeline Generated',

    // Customer metrics - Standard SaaS terms
    arpa: 'ARPA',
    endingCustomerCount: 'Total Customers',
  },

  defaultInputs: {
    beginningARR: 180, // Insurance customers buy bigger contracts
    totalCustomers: 85, // Fewer but larger enterprise customers
    expansionARR: 2200, // Strong upsell/cross-sell
    churnedARR: 650,
    customersChurned: 3, // Low logo churn (sticky enterprise)
    newCustomersAdded: 4, // Fewer new logos but high ACV
    leadsGenerated: 420,
    mqlsGenerated: 105,
    mqlToSQLConversion: 48, // Higher qualification rates (enterprise focus)
    sqlToOppConversion: 72,
    winRate: 38, // Higher close rates (consultative selling)
    avgDealSize: 850, // Large enterprise deals ($850K)
    salesCycle: 8.5, // Longer sales cycles (compliance, procurement)
    // Channel mix
    paidSearchSpend: 85,
    paidSearchLeads: 95,
    paidSocialSpend: 120,
    paidSocialLeads: 88,
    eventsSpend: 180, // Heavy event presence (insurance conferences)
    eventsLeads: 142,
    contentSpend: 75,
    contentLeads: 95,
    partnershipsSpend: 45, // System integrator partnerships
    partnershipsLeads: 0,
    // ABM
    targetAccounts: 150, // Highly targeted (top insurance carriers)
    engagedAccounts: 68,
    abmSpend: 220, // Heavy ABM investment
    // Paid media
    paidImpressions: 18000, // Lower volume, targeted
    paidClicks: 2400,
    totalSalesMarketing: 1850,
    marketingSpend: 505,
    rdSpend: 5200, // High R&D for insurance product complexity
    gaSpend: 2950,
    cogsPercent: 22, // Higher service costs (implementation, support)
    avgCustomerLifetime: 48, // Very sticky (4 years average)
  },

  personaLabels: {
    ceo: 'CEO / Board',
    cfo: 'CFO',
    sales: 'CRO',
    marketing: 'CMO',
  },
};

// Banking Vertical Configuration (Earnix selling TO banks)
export const bankingConfig: IndustryConfig = {
  id: 'banking',
  name: 'Banking',
  displayName: 'Banking',

  labelMappings: {
    // Starting Position - Standard SaaS terms
    beginningARR: 'Beginning ARR',
    totalCustomers: 'Total Customers',

    // Monthly Movement - Standard SaaS terms
    expansionARR: 'Expansion ARR',
    churnedARR: 'Churned ARR',
    customersChurned: 'Customers Churned',
    newCustomersAdded: 'New Customers Added',

    // Pipeline Funnel - Standard SaaS terms
    leadsGenerated: 'Leads Generated',
    mqlsGenerated: 'MQLs Generated',
    mqlToSQLConversion: 'MQL to SQL Rate (%)',
    sqlToOppConversion: 'SQL to Opp Rate (%)',
    winRate: 'Win Rate (%)',
    avgDealSize: 'Avg Deal Size',
    salesCycle: 'Sales Cycle (months)',

    // Channel Mix - Standard SaaS terms
    paidSearchSpend: 'Paid Search Spend',
    paidSearchLeads: 'Paid Search Leads',
    paidSocialSpend: 'Paid Social Spend',
    paidSocialLeads: 'Paid Social Leads',
    eventsSpend: 'Events Spend',
    eventsLeads: 'Events Leads',
    contentSpend: 'Content Spend',
    contentLeads: 'Content Leads',
    partnershipsSpend: 'Partnerships Spend',
    partnershipsLeads: 'Partnerships Leads',

    // ABM - Standard SaaS terms
    targetAccounts: 'Target Accounts',
    engagedAccounts: 'Engaged Accounts',
    abmSpend: 'ABM Spend',

    // Paid Media - Standard SaaS terms
    paidImpressions: 'Paid Impressions',
    paidClicks: 'Paid Clicks',

    // Operating Expenses - Standard SaaS terms
    totalSalesMarketing: 'Total Sales & Marketing',
    marketingSpend: 'Marketing Spend',
    rdSpend: 'R&D Spend',
    gaSpend: 'G&A Spend',

    // Customer Value - Standard SaaS terms
    cogsPercent: 'COGS (%)',
    avgCustomerLifetime: 'Avg Customer Lifetime (mo)',
  },

  metricLabels: {
    // ARR & Growth - Standard SaaS terms
    newBookings: 'New Bookings',
    netNewARR: 'Net New ARR',
    endingARR: 'Ending ARR',
    mrr: 'MRR',
    annualizedGrowthRate: 'ARR Growth Rate',

    // Retention - Standard SaaS terms
    annualizedGRR: 'Gross Retention Rate',
    annualizedNRR: 'Net Retention Rate',
    logoChurnRate: 'Logo Churn Rate',

    // Pipeline - Standard SaaS terms
    sqlsGenerated: 'SQLs Generated',
    opportunitiesCreated: 'Opportunities Created',
    dealsClosedWon: 'Deals Closed Won',
    pipelineGenerated: 'Pipeline Generated',

    // Customer metrics - Standard SaaS terms
    arpa: 'ARPA',
    endingCustomerCount: 'Total Customers',
  },

  defaultInputs: {
    beginningARR: 145, // Banking customers moderate deal sizes
    totalCustomers: 120, // More customers than Insurance (mid-market + enterprise mix)
    expansionARR: 1650, // Good expansion but less than Insurance
    churnedARR: 720,
    customersChurned: 5, // Moderate churn (regulatory switching costs help retention)
    newCustomersAdded: 7, // More new logos (broader market)
    leadsGenerated: 680,
    mqlsGenerated: 165,
    mqlToSQLConversion: 42, // Good qualification
    sqlToOppConversion: 68,
    winRate: 32, // Moderate win rates (competitive market)
    avgDealSize: 380, // Mid-market focus ($380K average)
    salesCycle: 6.5, // Moderate sales cycles (faster than Insurance)
    // Channel mix
    paidSearchSpend: 125,
    paidSearchLeads: 155,
    paidSocialSpend: 145,
    paidSocialLeads: 118,
    eventsSpend: 95, // Moderate event presence
    eventsLeads: 85,
    contentSpend: 65,
    contentLeads: 142,
    partnershipsSpend: 28, // Technology partnerships (core banking vendors)
    partnershipsLeads: 180,
    // ABM
    targetAccounts: 220, // Broader target list (regional + national banks)
    engagedAccounts: 85,
    abmSpend: 165,
    // Paid media
    paidImpressions: 24000,
    paidClicks: 3200,
    totalSalesMarketing: 1550,
    marketingSpend: 523,
    rdSpend: 4600, // Moderate R&D (less complex than Insurance)
    gaSpend: 2650,
    cogsPercent: 18, // Moderate service costs
    avgCustomerLifetime: 36, // Good retention (3 years average)
  },

  personaLabels: {
    ceo: 'CEO / Board',
    cfo: 'CFO',
    sales: 'CRO',
    marketing: 'CMO',
  },
};

// Map of all industry configurations
export const industryConfigs: Record<Industry, IndustryConfig> = {
  insurance: insuranceConfig,
  banking: bankingConfig,
};

// Helper function to get label for a field
export function getFieldLabel(industry: Industry, field: keyof IndustryConfig['labelMappings']): string {
  return industryConfigs[industry].labelMappings[field];
}

// Helper function to get metric label
export function getMetricLabel(industry: Industry, metric: keyof IndustryConfig['metricLabels']): string {
  return industryConfigs[industry].metricLabels[metric];
}
