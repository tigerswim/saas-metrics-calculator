'use client';

import { CalculatedMetrics } from '../types';
import FormulaExplainer from './FormulaExplainer';

interface MetricsDisplayProps {
  metrics: CalculatedMetrics;
  inputs?: any; // We'll pass inputs from Calculator for formula explainers
}

interface MetricItem {
  label: string;
  value: string;
  description?: string;
  showFormula?: 'grr' | 'nrr' | 'logoChurn';
  formulaValue?: number;
}

export default function MetricsDisplay({ metrics, inputs }: MetricsDisplayProps) {
  const formatCurrency = (value: number, decimals = 0) => {
    return `$${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatPercent = (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const formatNumber = (value: number, decimals = 0) => {
    return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const sections: Array<{ title: string; gradient: string; metrics: MetricItem[] }> = [
    {
      title: 'ARR & Growth Metrics',
      gradient: 'bg-gradient-arr',
      metrics: [
        { label: 'Net New ARR', value: formatCurrency(metrics.netNewARR, 0), description: 'New + Expansion - Churn' },
        { label: 'Ending ARR ($M)', value: formatCurrency(metrics.endingARR, 1) },
        { label: 'MRR ($M)', value: formatCurrency(metrics.mrr, 1) },
        { label: 'Monthly Revenue', value: formatCurrency(metrics.monthlyRevenue, 0) },
        { label: 'ARR Growth Rate (Monthly)', value: formatPercent(metrics.arrGrowthRateMonthly) },
        { label: 'Annualized Growth Rate', value: formatPercent(metrics.annualizedGrowthRate) },
      ],
    },
    {
      title: 'Retention Metrics',
      gradient: 'bg-gradient-retention',
      metrics: [
        { label: 'Gross Revenue Retention (GRR)', value: formatPercent(metrics.grr), description: 'Monthly GRR', showFormula: 'grr', formulaValue: metrics.grr },
        { label: 'Net Revenue Retention (NRR)', value: formatPercent(metrics.nrr), description: 'Monthly NRR', showFormula: 'nrr', formulaValue: metrics.nrr },
        { label: 'Annualized GRR', value: formatPercent(metrics.annualizedGRR) },
        { label: 'Annualized NRR', value: formatPercent(metrics.annualizedNRR) },
        { label: 'Logo Churn Rate', value: formatPercent(metrics.logoChurnRate), showFormula: 'logoChurn', formulaValue: metrics.logoChurnRate },
        { label: 'Ending Customer Count', value: formatNumber(metrics.endingCustomerCount) },
      ],
    },
    {
      title: 'Pipeline Metrics',
      gradient: 'bg-gradient-pipeline',
      metrics: [
        { label: 'SQLs Generated', value: formatNumber(metrics.sqlsGenerated) },
        { label: 'Opportunities Created', value: formatNumber(metrics.opportunitiesCreated) },
        { label: 'Deals Closed Won', value: formatNumber(metrics.dealsClosedWon) },
        { label: 'Pipeline Generated', value: formatCurrency(metrics.pipelineGenerated, 0) },
        { label: 'Pipeline Conversion (MQL→Won)', value: formatPercent(metrics.pipelineConversion) },
        { label: 'Pipeline Velocity ($/day)', value: formatCurrency(metrics.pipelineVelocity, 0) },
      ],
    },
    {
      title: 'Marketing Efficiency',
      gradient: 'bg-gradient-marketing',
      metrics: [
        { label: 'CAC - Blended', value: formatCurrency(metrics.cacBlended, 0), description: 'Total S&M / New Customers' },
        { label: 'CAC - Paid Only', value: formatCurrency(metrics.cacPaidOnly, 0), description: 'Paid Marketing / New Customers' },
        { label: 'LTV', value: formatCurrency(metrics.ltv, 0), description: 'ARPA × Lifetime (months)' },
        { label: 'LTV:CAC Ratio', value: `${metrics.ltvCacRatio.toFixed(1)}x` },
        { label: 'CAC Payback Period', value: `${metrics.cacPaybackPeriod.toFixed(1)} months`, description: 'CAC / (ARPA × Gross Margin)' },
        { label: 'Cost per MQL', value: formatCurrency(metrics.costPerMQL, 0) },
        { label: 'Cost per SQL', value: formatCurrency(metrics.costPerSQL, 0) },
        { label: 'CPM', value: formatCurrency(metrics.cpm, 2), description: 'Cost per 1K Impressions' },
        { label: 'CPC', value: formatCurrency(metrics.cpc, 2), description: 'Cost per Click' },
        { label: 'CTR', value: formatPercent(metrics.ctr, 2), description: 'Click-Through Rate' },
      ],
    },
    {
      title: 'Sales Efficiency',
      gradient: 'bg-gradient-sales',
      metrics: [
        { label: 'Magic Number', value: `${metrics.magicNumber.toFixed(2)}x`, description: 'Net New ARR / S&M Spend' },
        { label: 'Payback Period on S&M', value: `${metrics.paybackPeriodSM.toFixed(1)} months` },
      ],
    },
    {
      title: 'Financial Performance',
      gradient: 'bg-gradient-financial',
      metrics: [
        { label: 'Gross Profit', value: formatCurrency(metrics.grossProfit, 0) },
        { label: 'Gross Margin', value: formatPercent(metrics.grossMargin) },
        { label: 'Total OpEx', value: formatCurrency(metrics.totalOpEx, 0) },
        { label: 'EBITDA', value: formatCurrency(metrics.ebitda, 0) },
        { label: 'EBITDA Margin', value: formatPercent(metrics.ebitdaMargin) },
        { label: 'Rule of 40', value: formatPercent(metrics.ruleOf40), description: 'Growth Rate + EBITDA Margin' },
        { label: 'SaaS Quick Ratio', value: `${metrics.saasQuickRatio.toFixed(1)}x`, description: '(New + Expansion) / Churn' },
        { label: 'Burn Multiple', value: `${metrics.burnMultiple.toFixed(1)}x`, description: 'Net Burn / Net New ARR' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`${section.gradient} px-6 py-3`}>
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          </div>
          <div className="p-6 space-y-3">
            {section.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between items-start border-b border-slate-100 pb-2 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-700">{metric.label}</div>
                    {metric.description && (
                      <div className="text-xs text-slate-500 mt-0.5">{metric.description}</div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 ml-4">{metric.value}</div>
                </div>
                {metric.showFormula && inputs && (
                  <FormulaExplainer
                    metricName={metric.showFormula}
                    inputs={inputs}
                    result={metric.formulaValue || 0}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
