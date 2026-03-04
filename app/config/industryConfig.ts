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
    beginningARR: 117, // $117M ARR (90% of $130M total company ARR)
    totalCustomers: 117, // 117 insurance accounts (90% of 130 total)
    expansionARR: 1800, // ~$21.6M/yr expansion (balanced new logo + expansion growth)
    churnedARR: 900, // ~$10.8M/yr churn → GRR ~90.8%
    customersChurned: 1, // ~1% monthly logo churn (very sticky enterprise)
    newCustomersAdded: 3, // ~3 new logos/month at ~$1M ACV
    leadsGenerated: 320, // Narrow ICP universe (insurance carriers)
    mqlsGenerated: 80,
    mqlToSQLConversion: 45, // Strong qualification (enterprise focus)
    sqlToOppConversion: 65,
    winRate: 35, // Strong win rate (differentiated product)
    avgDealSize: 1000, // $1M avg ACV ($750K–$1.5M range)
    salesCycle: 7.5, // 6–9 month sales cycle (compliance, procurement)
    // Channel mix
    paidSearchSpend: 75,
    paidSearchLeads: 60,
    paidSocialSpend: 95,
    paidSocialLeads: 55,
    eventsSpend: 220, // Heavy event presence (insurance conferences)
    eventsLeads: 110,
    contentSpend: 85,
    contentLeads: 75,
    partnershipsSpend: 55, // System integrator partnerships
    partnershipsLeads: 20,
    // ABM
    targetAccounts: 500, // ~400–600 ICP accounts (tier-1 + large regional carriers)
    engagedAccounts: 145, // ~29% engagement rate
    abmSpend: 280, // Heavy ABM investment (narrow, high-value market)
    // Paid media
    paidImpressions: 12000, // Low volume, highly targeted
    paidClicks: 1600,
    totalSalesMarketing: 3025, // ~$36M/yr = ~28% of ARR
    marketingSpend: 530, // Sum of channel spend
    rdSpend: 3250, // ~$39M/yr = ~30% of ARR
    gaSpend: 1950, // ~$23M/yr = ~18% of ARR
    cogsPercent: 22, // Higher service costs (complex implementations)
    avgCustomerLifetime: 60, // 5 years — very sticky enterprise (regulatory switching costs)
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
    beginningARR: 13, // $13M ARR (10% of $130M total company ARR)
    totalCustomers: 13, // 13 banking accounts (10% of 130 total)
    expansionARR: 250, // ~$3M/yr expansion (early-stage, less upsell history)
    churnedARR: 100, // ~$1.2M/yr churn → GRR ~90.8%
    customersChurned: 0, // <1 logo/month (small base, high retention focus)
    newCustomersAdded: 2, // ~2 new logos/month (aggressive growth, emerging market)
    leadsGenerated: 480, // More leads (broader outreach, building awareness)
    mqlsGenerated: 110,
    mqlToSQLConversion: 38, // Lower qualification (still building ICP definition)
    sqlToOppConversion: 60,
    winRate: 28, // Lower win rate (newer market, less proven)
    avgDealSize: 500, // $500K ACV ($400K–$600K range, mid-market banks)
    salesCycle: 6.0, // Slightly faster (less regulatory complexity than insurance)
    // Channel mix
    paidSearchSpend: 90,
    paidSearchLeads: 120,
    paidSocialSpend: 110,
    paidSocialLeads: 95,
    eventsSpend: 120, // Strong events (building brand in banking)
    eventsLeads: 145,
    contentSpend: 70,
    contentLeads: 120,
    partnershipsSpend: 40, // Core banking vendor partnerships (Temenos, Finastra)
    partnershipsLeads: 0,
    // ABM
    targetAccounts: 300, // Broader TAM (regional + national banks)
    engagedAccounts: 75, // 25% engagement rate (early-stage market dev)
    abmSpend: 180,
    // Paid media
    paidImpressions: 18000,
    paidClicks: 2400,
    totalSalesMarketing: 420, // ~$5M/yr = ~38% of ARR (investing ahead of growth)
    marketingSpend: 430, // Sum of channel spend
    rdSpend: 390, // ~$4.7M/yr = ~36% of ARR (heavy investment phase)
    gaSpend: 195, // ~$2.3M/yr = ~18% of ARR
    cogsPercent: 25, // Higher COGS (early-stage, less efficient delivery)
    avgCustomerLifetime: 36, // 3 years (less proven than insurance, building track record)
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
