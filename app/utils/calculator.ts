// utils/calculator.ts
import { Inputs, CalculatedMetrics, KeyMetric } from '../types';

export function calculateMetrics(inputs: Inputs): CalculatedMetrics {
  const {
    beginningARR,
    totalCustomers,
    expansionARR,
    churnedARR,
    customersChurned,
    newCustomersAdded,
    mqlsGenerated,
    mqlToSQLConversion,
    sqlToOppConversion,
    winRate,
    avgDealSize,
    salesCycle,
    // Channel mix inputs
    paidSearchSpend,
    paidSocialSpend,
    eventsSpend,
    contentSpend,
    partnershipsSpend,
    paidImpressions,
    paidClicks,
    totalSalesMarketing,
    marketingSpend,
    rdSpend,
    gaSpend,
    cogsPercent,
    avgCustomerLifetime,
  } = inputs;

  // Use the configured marketing spend
  const totalMarketingSpend = marketingSpend;
  const paidMarketingSpend = paidSearchSpend + paidSocialSpend;

  // Calculate New Bookings from new customers and deal size
  const newBookings = newCustomersAdded * avgDealSize;

  // ARR & Growth Metrics
  const netNewARR = newBookings + expansionARR - churnedARR;
  const endingARR = beginningARR * 1000 + netNewARR; // beginningARR is in $M
  const mrr = endingARR / 12;
  const arrGrowthRateMonthly = (netNewARR / (beginningARR * 1000)) * 100;
  const annualizedGrowthRate = Math.pow(1 + arrGrowthRateMonthly / 100, 12) - 1;

  // Retention Metrics
  const startingARRInK = beginningARR * 1000;
  const grr = ((startingARRInK - churnedARR) / startingARRInK) * 100;
  const nrr = ((startingARRInK - churnedARR + expansionARR) / startingARRInK) * 100;
  const annualizedGRR = Math.pow(grr / 100, 12) * 100;
  const annualizedNRR = Math.pow(nrr / 100, 12) * 100;
  const logoChurnRate = (customersChurned / totalCustomers) * 100;
  const endingCustomerCount = totalCustomers - customersChurned + newCustomersAdded;

  // Pipeline Metrics
  const sqlsGenerated = Math.round(mqlsGenerated * (mqlToSQLConversion / 100));
  const opportunitiesCreated = Math.round(sqlsGenerated * (sqlToOppConversion / 100));
  const dealsClosedWon = Math.round(opportunitiesCreated * (winRate / 100));
  const pipelineGenerated = opportunitiesCreated * avgDealSize;
  const pipelineConversion = (dealsClosedWon / (mqlsGenerated || 1)) * 100;
  // Pipeline Velocity: (Opportunities × Deal Size × Win Rate) / Sales Cycle in days
  // Measures: expected revenue throughput per day
  const pipelineVelocity = (opportunitiesCreated * avgDealSize * 1000 * (winRate / 100)) / (salesCycle * 30);

  // Calculate ARPA
  const arpa = (beginningARR * 1000000) / totalCustomers / 12; // Monthly ARPA

  // Marketing Efficiency Metrics
  const cacBlended = totalSalesMarketing / (newCustomersAdded || 1); // in $K
  const cacPaidOnly = paidMarketingSpend / (newCustomersAdded || 1); // in $K
  const ltv = arpa * avgCustomerLifetime;
  const ltvCacRatio = ltv / (cacBlended * 1000); // Convert CAC from $K to $
  const grossMargin = 100 - cogsPercent;
  const cacPaybackPeriod = (cacBlended * 1000) / (arpa * (grossMargin / 100)); // Convert CAC from $K to $
  const costPerLead = (totalMarketingSpend * 1000) / (inputs.leadsGenerated || 1); // Convert from $K to $
  const costPerMQL = (totalMarketingSpend * 1000) / (mqlsGenerated || 1); // Convert from $K to $
  const costPerSQL = (totalMarketingSpend * 1000) / (sqlsGenerated || 1); // Convert from $K to $
  const costPerOpp = (totalMarketingSpend * 1000) / (opportunitiesCreated || 1); // Convert from $K to $
  const costPerWon = (totalMarketingSpend * 1000) / (dealsClosedWon || 1); // Convert from $K to $
  const cpm = (paidMarketingSpend / (paidImpressions || 1)) * 1000;
  const cpc = (paidMarketingSpend * 1000) / (paidClicks || 1); // Convert from $K to $
  const ctr = (paidClicks / (paidImpressions || 1)) * 100;

  // Conversion rates for acquisition funnel
  const clickToLeadRate = paidClicks > 0 ? (inputs.leadsGenerated / paidClicks) * 100 : 0;
  const leadToMQLRate = inputs.leadsGenerated > 0 ? (mqlsGenerated / inputs.leadsGenerated) * 100 : 0;

  // Sales Efficiency Metrics
  const magicNumber = netNewARR / totalSalesMarketing;
  const paybackPeriodSM = cacBlended / (netNewARR / (newCustomersAdded || 1));

  // Financial Performance Metrics
  const grossProfit = mrr * (grossMargin / 100);
  const totalOpEx = totalSalesMarketing + rdSpend + gaSpend;
  const ebitda = grossProfit - totalOpEx;
  const ebitdaMargin = (ebitda / mrr) * 100;
  const ruleOf40 = (annualizedGrowthRate * 100) + ebitdaMargin;
  const saasQuickRatio = (newBookings + expansionARR) / (churnedARR || 1);
  // Burn Multiple only meaningful when EBITDA is negative (company is burning cash)
  // When profitable (EBITDA >= 0), burn multiple is 0 (no burn)
  const burnMultiple = ebitda < 0 ? Math.abs(ebitda) / (netNewARR || 1) : 0;

  return {
    newBookings,
    netNewARR,
    endingARR: endingARR / 1000, // Convert back to $M
    mrr: mrr / 1000, // Convert to $M
    arrGrowthRateMonthly,
    annualizedGrowthRate: annualizedGrowthRate * 100,
    grr,
    nrr,
    annualizedGRR,
    annualizedNRR,
    logoChurnRate,
    endingCustomerCount,
    sqlsGenerated,
    opportunitiesCreated,
    dealsClosedWon,
    pipelineGenerated,
    pipelineConversion,
    pipelineVelocity,
    cacBlended,
    cacPaidOnly,
    ltv,
    ltvCacRatio,
    cacPaybackPeriod,
    costPerLead,
    costPerMQL,
    costPerSQL,
    costPerOpp,
    costPerWon,
    cpm,
    cpc,
    ctr,
    clickToLeadRate,
    leadToMQLRate,
    magicNumber,
    paybackPeriodSM,
    grossProfit,
    grossMargin,
    totalOpEx,
    ebitda,
    ebitdaMargin,
    ruleOf40,
    saasQuickRatio,
    burnMultiple,
    arpa,
  };
}

export function getKeyMetrics(metrics: CalculatedMetrics): KeyMetric[] {
  return [
    {
      name: 'ARR Growth',
      value: `${metrics.annualizedGrowthRate.toFixed(1)}%`,
      target: '>20%',
      status: metrics.annualizedGrowthRate >= 20 ? 'good' :
              metrics.annualizedGrowthRate >= 10 ? 'warning' : 'bad',
      tooltip: 'Annualized ARR growth rate',
    },
    {
      name: 'GRR',
      value: `${metrics.annualizedGRR.toFixed(1)}%`,
      target: '>90%',
      status: metrics.annualizedGRR >= 90 ? 'good' : metrics.annualizedGRR >= 80 ? 'warning' : 'bad',
      tooltip: 'Gross Revenue Retention (annualized)',
    },
    {
      name: 'NRR',
      value: `${metrics.annualizedNRR.toFixed(1)}%`,
      target: '>110%',
      status: metrics.annualizedNRR >= 110 ? 'good' : metrics.annualizedNRR >= 100 ? 'warning' : 'bad',
      tooltip: 'Net Revenue Retention (annualized)',
    },
    {
      name: 'LTV:CAC',
      value: `${metrics.ltvCacRatio.toFixed(1)}x`,
      target: '>3.0x',
      status: metrics.ltvCacRatio >= 3 ? 'good' : metrics.ltvCacRatio >= 2 ? 'warning' : 'bad',
      tooltip: 'Customer lifetime value vs acquisition cost',
    },
    {
      name: 'CAC Payback',
      value: `${metrics.cacPaybackPeriod.toFixed(0)} mo`,
      target: '<18mo',
      status: metrics.cacPaybackPeriod <= 12 ? 'good' : metrics.cacPaybackPeriod <= 18 ? 'warning' : 'bad',
      tooltip: 'Months to recover customer acquisition cost',
    },
    {
      name: 'Rule of 40',
      value: `${metrics.ruleOf40.toFixed(0)}%`,
      target: '>40%',
      status: metrics.ruleOf40 >= 40 ? 'good' : metrics.ruleOf40 >= 25 ? 'warning' : 'bad',
      tooltip: 'Growth Rate + EBITDA Margin',
    },
    {
      name: 'Magic #',
      value: `${metrics.magicNumber.toFixed(2)}x`,
      target: '>0.75x',
      status: metrics.magicNumber >= 1.0 ? 'good' : metrics.magicNumber >= 0.75 ? 'warning' : 'bad',
      tooltip: 'S&M efficiency: Net New ARR / S&M Spend',
    },
    {
      name: 'Logo Churn',
      value: `${metrics.logoChurnRate.toFixed(1)}%`,
      target: '<1.5%',
      status: metrics.logoChurnRate <= 1.5 ? 'good' : metrics.logoChurnRate <= 3 ? 'warning' : 'bad',
      tooltip: 'Monthly customer churn rate',
    },
    {
      name: 'Gross Margin',
      value: `${metrics.grossMargin.toFixed(0)}%`,
      target: '>75%',
      status: metrics.grossMargin >= 75 ? 'good' : metrics.grossMargin >= 65 ? 'warning' : 'bad',
      tooltip: 'Revenue minus cost of goods sold',
    },
    {
      name: 'Quick Ratio',
      value: `${metrics.saasQuickRatio.toFixed(1)}x`,
      target: '>4.0x',
      status: metrics.saasQuickRatio >= 4 ? 'good' : metrics.saasQuickRatio >= 2 ? 'warning' : 'bad',
      tooltip: '(New + Expansion) / Churn - growth efficiency',
    },
  ];
}