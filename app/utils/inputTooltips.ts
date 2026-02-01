import { Inputs } from '../types';

export const inputTooltips: Record<keyof Inputs, string> = {
  beginningARR:
    'Your total annual recurring revenue at the start of the month. Enter in millions (e.g., 150 = $150M ARR).',

  totalCustomers:
    'The total number of customer accounts at the start of the month. Count paying customers only, not free users.',

  // newBookings is now calculated: newCustomersAdded × avgDealSize

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

  // Channel Mix
  paidSearchSpend:
    'Google/Bing ads spend this month, in thousands (e.g., 120 = $120K). High-intent search traffic.',

  paidSearchLeads:
    'Leads generated from paid search campaigns this month. Typically higher intent than social.',

  paidSocialSpend:
    'LinkedIn, Meta, Twitter ads spend this month, in thousands (e.g., 165 = $165K).',

  paidSocialLeads:
    'Leads generated from paid social campaigns this month. Good for awareness and targeting.',

  eventsSpend:
    'Events, webinars, trade shows spend this month, in thousands. Include sponsorships and hosting costs.',

  eventsLeads:
    'Leads captured from events and webinars this month. Often higher quality, lower volume.',

  contentSpend:
    'Content marketing and SEO spend this month, in thousands. Include content creation and distribution.',

  contentLeads:
    'Leads from organic content (blog, SEO, gated assets). Often lower cost, longer sales cycle.',

  partnershipsSpend:
    'Partner marketing, affiliate, and referral program spend this month, in thousands.',

  partnershipsLeads:
    'Leads from partnerships, referrals, and affiliates. Often highest quality, hardest to scale.',

  // ABM metrics
  targetAccounts:
    'Total accounts in your ABM program. These are high-value accounts you are actively targeting.',

  engagedAccounts:
    'Target accounts showing meaningful activity (site visits, content downloads, ad clicks, email opens).',

  abmSpend:
    'Marketing spend allocated to ABM programs, in thousands. Includes ABM platforms, targeted ads, direct mail, events.',

  paidImpressions:
    'Total ad impressions from paid campaigns this month (e.g., 25000 = 25K impressions).',

  paidClicks:
    'Total clicks on paid ads this month (e.g., 3500 = 3,500 clicks).',

  totalSalesMarketing:
    'Combined sales & marketing expenses this month, in thousands (e.g., 6500 = $6.5M). Used for CAC calculations.',

  marketingSpend:
    'Total marketing expenses (subset of S&M) this month, in thousands. Sum of all marketing channel spend.',

  rdSpend:
    'Research & Development spend this month, in thousands (e.g., 3200 = $3.2M).',

  gaSpend:
    'General & Administrative expenses this month, in thousands (e.g., 1800 = $1.8M).',

  cogsPercent:
    'Cost of Goods Sold as percentage of revenue. Enter as whole number (e.g., 18 = 18% COGS).',

  avgCustomerLifetime:
    'Average customer lifetime in months (e.g., 60 = customers stay 5 years on average). Use historical data or 1/churn rate.',
};
