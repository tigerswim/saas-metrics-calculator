import { Inputs } from '../types';

export const inputTooltips: Record<keyof Inputs, string> = {
  beginningARR:
    'Your total annual recurring revenue at the start of the month. Enter in millions (e.g., 150 = $150M ARR).',

  totalCustomers:
    'The total number of customer accounts at the start of the month. Count paying customers only, not free users.',

  newBookings:
    'New ARR from customers acquired this month, in thousands (e.g., 3500 = $3.5M). Include only first-time customers.',

  expansionARR:
    'Additional ARR from existing customers this month (upsells, cross-sells), in thousands (e.g., 1200 = $1.2M).',

  churnedARR:
    'ARR lost from customers who cancelled or downgraded this month, in thousands (e.g., 800 = $800K).',

  customersChurned:
    'Number of customer accounts that cancelled completely this month. Do not include downgrades.',

  newCustomersAdded:
    'Number of new customer accounts acquired this month. Should align with your new bookings.',

  leadsGenerated:
    'Total leads captured this month (form fills, demo requests, content downloads, etc.). Raw leads before qualification.',

  mqlsGenerated:
    'Marketing Qualified Leads generated this month. Leads that meet your scoring criteria for sales follow-up.',

  mqlToSQLConversion:
    'Percentage of MQLs that become Sales Qualified Leads. Enter as whole number (e.g., 40 = 40%).',

  sqlToOppConversion:
    'Percentage of SQLs that convert to sales opportunities. Enter as whole number (e.g., 65 = 65%).',

  winRate:
    'Percentage of opportunities that close as won deals. Enter as whole number (e.g., 28 = 28% win rate).',

  avgDealSize:
    'Average ARR value per closed deal, in thousands (e.g., 175 = $175K average deal size).',

  salesCycle:
    'Average time from opportunity creation to close, in months (e.g., 4.5 = 4.5 months).',

  totalMarketingSpend:
    'Total marketing spend this month, in thousands (e.g., 2800 = $2.8M). Include all marketing costs.',

  paidMarketingSpend:
    'Paid advertising spend this month, in thousands (e.g., 1400 = $1.4M). Subset of total marketing.',

  paidImpressions:
    'Total ad impressions from paid campaigns this month (e.g., 25000 = 25K impressions).',

  paidClicks:
    'Total clicks on paid ads this month (e.g., 3500 = 3,500 clicks).',

  totalSalesMarketing:
    'Combined sales & marketing expenses this month, in thousands (e.g., 6500 = $6.5M). Used for CAC calculations.',

  rdSpend:
    'Research & Development spend this month, in thousands (e.g., 3200 = $3.2M).',

  gaSpend:
    'General & Administrative expenses this month, in thousands (e.g., 1800 = $1.8M).',

  cogsPercent:
    'Cost of Goods Sold as percentage of revenue. Enter as whole number (e.g., 18 = 18% COGS).',

  avgCustomerLifetime:
    'Average customer lifetime in months (e.g., 60 = customers stay 5 years on average). Use historical data or 1/churn rate.',
};
