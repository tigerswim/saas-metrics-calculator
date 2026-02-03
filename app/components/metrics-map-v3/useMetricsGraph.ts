// Hook to generate React Flow nodes and edges from metrics data

import { useMemo } from 'react';
import { Node, Edge } from '@xyflow/react';
import { CalculatedMetrics, Inputs } from '../../types';
import { metricsRelationships } from '../../utils/metricsGraph';
import { getCalculatedMetricStatus } from '../../utils/metricTargets';
import { formatMetricValue } from '../../utils/metricsMapUtils';

export interface MetricNodeData {
  label: string;
  value: string;
  tier: 'budget' | 'activities' | 'acquisition' | 'revenue' | 'outcomes';
  status: 'good' | 'warning' | 'bad' | 'neutral';
  isPrimary?: boolean;
  sparklineData?: number[];
  changePercent?: number;
  [key: string]: any; // Allow additional properties
}

/**
 * Get the tier for a given metric ID
 */
function getMetricTier(metricId: string): MetricNodeData['tier'] {
  // Budget layer
  if ([
    'sales-marketing-spend',
    'marketing-spend',
    'sales-spend',
    'rd-spend',
    'ga-spend',
    'total-opex',
  ].includes(metricId)) {
    return 'budget';
  }

  // Activities layer
  if ([
    'paid-search',
    'paid-social',
    'events',
    'content',
    'partnerships',
    'abm',
  ].includes(metricId)) {
    return 'activities';
  }

  // Acquisition layer
  if ([
    'impressions',
    'clicks',
    'leads',
    'mqls',
    'sqls',
    'opportunities',
    'deals-won',
    'cpm',
    'cpc',
    'ctr',
    'cost-per-lead',
    'cost-per-mql',
    'cost-per-sql',
    'click-to-lead-rate',
    'lead-to-mql-rate',
    'mql-to-sql-rate',
    'sql-to-opp-rate',
    'win-rate',
    'pipeline-generated',
    'pipeline-velocity',
    'pipeline-conversion',
  ].includes(metricId)) {
    return 'acquisition';
  }

  // Revenue layer
  if ([
    'new-bookings',
    'new-customers-added',
    'expansion-arr',
    'churned-arr',
    'net-new-arr',
    'beginning-arr',
    'ending-arr',
    'mrr',
    'arr-growth-rate',
    'grr',
    'nrr',
    'annualized-grr',
    'annualized-nrr',
    'logo-churn-rate',
    'customers-churned',
    'ending-customer-count',
    'arpa',
  ].includes(metricId)) {
    return 'revenue';
  }

  // Outcomes layer (default)
  return 'outcomes';
}

/**
 * Get formatted metric value
 */
function getMetricValue(metricId: string, metrics: CalculatedMetrics, inputs: Inputs): string {
  const valueMap: Record<string, string> = {
    // Budget
    'sales-marketing-spend': `$${(inputs.totalSalesMarketing * 1000).toLocaleString()}`,
    'marketing-spend': `$${((inputs.paidSearchSpend + inputs.paidSocialSpend + inputs.eventsSpend + inputs.contentSpend + inputs.partnershipsSpend + inputs.abmSpend) * 1000).toLocaleString()}`,
    'sales-spend': `$${((inputs.totalSalesMarketing - (inputs.paidSearchSpend + inputs.paidSocialSpend + inputs.eventsSpend + inputs.contentSpend + inputs.partnershipsSpend + inputs.abmSpend)) * 1000).toLocaleString()}`,
    'rd-spend': `$${(inputs.rdSpend * 1000).toLocaleString()}`,
    'ga-spend': `$${(inputs.gaSpend * 1000).toLocaleString()}`,

    // Activities
    'paid-search': `$${(inputs.paidSearchSpend * 1000).toLocaleString()}`,
    'paid-social': `$${(inputs.paidSocialSpend * 1000).toLocaleString()}`,
    'events': `$${(inputs.eventsSpend * 1000).toLocaleString()}`,
    'content': `$${(inputs.contentSpend * 1000).toLocaleString()}`,
    'partnerships': `$${(inputs.partnershipsSpend * 1000).toLocaleString()}`,
    'abm': `$${(inputs.abmSpend * 1000).toLocaleString()}`,

    // Acquisition - Volume
    'impressions': inputs.paidImpressions.toLocaleString(),
    'clicks': inputs.paidClicks.toLocaleString(),
    'leads': inputs.leadsGenerated.toLocaleString(),
    'mqls': inputs.mqlsGenerated.toLocaleString(),
    'sqls': metrics.sqlsGenerated.toLocaleString(),
    'opportunities': metrics.opportunitiesCreated.toLocaleString(),
    'deals-won': metrics.dealsClosedWon.toLocaleString(),

    // Acquisition - Efficiency
    'cpm': `$${metrics.cpm.toFixed(2)}`,
    'cpc': `$${metrics.cpc.toFixed(2)}`,
    'ctr': `${metrics.ctr.toFixed(2)}%`,
    'cost-per-lead': `$${Math.round(metrics.costPerLead).toLocaleString()}`,
    'cost-per-mql': `$${Math.round(metrics.costPerMQL).toLocaleString()}`,
    'cost-per-sql': `$${Math.round(metrics.costPerSQL).toLocaleString()}`,
    'cost-per-opp': `$${Math.round(metrics.costPerOpp).toLocaleString()}`,
    'cost-per-won': `$${Math.round(metrics.costPerWon).toLocaleString()}`,

    // Acquisition - Conversion Rates
    'click-to-lead-rate': `${metrics.clickToLeadRate.toFixed(1)}%`,
    'lead-to-mql-rate': `${metrics.leadToMQLRate.toFixed(1)}%`,
    'mql-to-sql-rate': `${inputs.mqlToSQLConversion}%`,
    'sql-to-opp-rate': `${inputs.sqlToOppConversion}%`,
    'win-rate': `${inputs.winRate}%`,

    // Acquisition - Pipeline
    'pipeline-generated': `$${(metrics.pipelineGenerated / 1000).toFixed(1)}M`,
    'pipeline-velocity': `$${Math.round(metrics.pipelineVelocity).toLocaleString()}/day`,
    'pipeline-conversion': `${metrics.pipelineConversion.toFixed(1)}%`,

    // Revenue
    'new-customers-added': inputs.newCustomersAdded.toLocaleString(),
    'new-bookings': `$${(metrics.newBookings / 1000).toFixed(1)}M`,
    'expansion-arr': `$${(inputs.expansionARR / 1000).toFixed(1)}M`,
    'churned-arr': `$${(inputs.churnedARR / 1000).toFixed(1)}M`,
    'net-new-arr': `$${(metrics.netNewARR / 1000).toFixed(1)}M`,
    'beginning-arr': `$${inputs.beginningARR.toFixed(1)}M`,
    'ending-arr': `$${metrics.endingARR.toFixed(1)}M`, // endingARR is already in $M from calculator
    'mrr': `$${Math.round(metrics.mrr * 1000).toLocaleString()}`, // mrr is in $M, multiply by 1000 to get $K, then display
    'arr-growth-rate': `${metrics.annualizedGrowthRate.toFixed(1)}%`,
    'grr': `${metrics.grr.toFixed(1)}%`,
    'nrr': `${metrics.nrr.toFixed(1)}%`,
    'annualized-grr': `${metrics.annualizedGRR.toFixed(0)}%`,
    'annualized-nrr': `${metrics.annualizedNRR.toFixed(0)}%`,
    'logo-churn-rate': `${metrics.logoChurnRate.toFixed(1)}%`,
    'customers-churned': inputs.customersChurned.toLocaleString(),
    'ending-customer-count': metrics.endingCustomerCount.toLocaleString(),
    'arpa': `$${metrics.arpa.toLocaleString()}`,

    // Outcomes
    'gross-margin': `${metrics.grossMargin.toFixed(1)}%`,
    'ebitda-margin': `${metrics.ebitdaMargin.toFixed(1)}%`,
    'rule-of-40': `${metrics.ruleOf40.toFixed(1)}%`,
    'gross-profit': `$${Math.round(metrics.grossProfit * 1000).toLocaleString()}`,
    'total-opex': `$${Math.round(metrics.totalOpEx * 1000).toLocaleString()}`,
    'ebitda': `$${Math.round(metrics.ebitda * 1000).toLocaleString()}`,
    'cac-blended': `$${Math.round(metrics.cacBlended * 1000).toLocaleString()}`,
    'cac-paid-only': `$${Math.round(metrics.cacPaidOnly * 1000).toLocaleString()}`,
    'ltv': `$${Math.round(metrics.ltv).toLocaleString()}`,
    'ltv-cac-ratio': `${metrics.ltvCacRatio.toFixed(1)}x`,
    'magic-number': `${metrics.magicNumber.toFixed(2)}x`,
    'quick-ratio': `${metrics.saasQuickRatio.toFixed(1)}x`,
    'burn-multiple': `${metrics.burnMultiple.toFixed(1)}x`,
    'cac-payback-period': `${metrics.cacPaybackPeriod.toFixed(1)} mo`,
    'payback-period-sm': `${metrics.paybackPeriodSM.toFixed(1)} mo`,
  };

  return valueMap[metricId] || '-';
}

/**
 * Get metric label
 */
function getMetricLabel(metricId: string): string {
  const labelMap: Record<string, string> = {
    // Budget
    'sales-marketing-spend': 'S&M Spend',
    'marketing-spend': 'Marketing Spend',
    'sales-spend': 'Sales Spend',
    'rd-spend': 'R&D Spend',
    'ga-spend': 'G&A Spend',

    // Activities
    'paid-search': 'Paid Search',
    'paid-social': 'Paid Social',
    'events': 'Events',
    'content': 'Content',
    'partnerships': 'Partnerships',
    'abm': 'ABM',

    // Acquisition
    'impressions': 'Impressions',
    'clicks': 'Clicks',
    'leads': 'Leads',
    'mqls': 'MQLs',
    'sqls': 'SQLs',
    'opportunities': 'Opportunities',
    'deals-won': 'Deals Won',
    'cpm': 'CPM',
    'cpc': 'CPC',
    'ctr': 'CTR',
    'cost-per-lead': 'Cost/Lead',
    'cost-per-mql': 'Cost/MQL',
    'cost-per-sql': 'Cost/SQL',
    'cost-per-opp': 'Cost/Opp',
    'cost-per-won': 'Cost/Won',
    'click-to-lead-rate': 'Click→Lead',
    'lead-to-mql-rate': 'Lead→MQL',
    'mql-to-sql-rate': 'MQL→SQL',
    'sql-to-opp-rate': 'SQL→Opp',
    'win-rate': 'Win Rate',
    'pipeline-generated': 'Pipeline Value',
    'pipeline-velocity': 'Pipeline Velocity',
    'pipeline-conversion': 'Pipeline Conv.',

    // Revenue
    'new-customers-added': 'New Customers',
    'new-bookings': 'New Bookings',
    'expansion-arr': 'Expansion ARR',
    'churned-arr': 'Churned ARR',
    'net-new-arr': 'Net New ARR',
    'beginning-arr': 'Beginning ARR',
    'ending-arr': 'Ending ARR',
    'mrr': 'MRR',
    'arr-growth-rate': 'ARR Growth',
    'grr': 'GRR',
    'nrr': 'NRR',
    'annualized-grr': 'GRR (Annual)',
    'annualized-nrr': 'NRR (Annual)',
    'logo-churn-rate': 'Logo Churn',
    'customers-churned': 'Customers Churned',
    'ending-customer-count': 'Total Customers',
    'arpa': 'ARPA',

    // Outcomes
    'gross-margin': 'Gross Margin',
    'ebitda-margin': 'EBITDA Margin',
    'rule-of-40': 'Rule of 40',
    'gross-profit': 'Gross Profit',
    'total-opex': 'Total OpEx',
    'ebitda': 'EBITDA',
    'cac-blended': 'CAC (Blended)',
    'cac-paid-only': 'CAC (Paid)',
    'ltv': 'LTV',
    'ltv-cac-ratio': 'LTV:CAC Ratio',
    'magic-number': 'Magic Number',
    'quick-ratio': 'Quick Ratio',
    'burn-multiple': 'Burn Multiple',
    'cac-payback-period': 'CAC Payback',
    'payback-period-sm': 'S&M Payback',
  };

  return labelMap[metricId] || metricId;
}

/**
 * Generate nodes from metrics data
 */
export function useMetricsGraph(
  metrics: CalculatedMetrics,
  inputs: Inputs
): { nodes: Node<MetricNodeData>[]; edges: Edge[] } {
  return useMemo(() => {
    // Get all metric IDs from relationships
    const metricIds = Object.keys(metricsRelationships);

    // Generate nodes
    const nodes: Node<MetricNodeData>[] = metricIds.map(metricId => {
      const tier = getMetricTier(metricId);
      const label = getMetricLabel(metricId);
      const value = getMetricValue(metricId, metrics, inputs);
      const status = getCalculatedMetricStatus(metricId, metrics, inputs);

      return {
        id: metricId,
        type: 'standard',
        position: { x: 0, y: 0 }, // Will be computed by layout
        data: {
          label,
          value,
          tier,
          status,
        },
      };
    });

    // Generate edges from relationships
    const edges: Edge[] = [];
    metricIds.forEach(metricId => {
      const relationship = metricsRelationships[metricId];
      if (relationship && relationship.outputs) {
        relationship.outputs.forEach(outputId => {
          edges.push({
            id: `${metricId}-${outputId}`,
            source: metricId,
            target: outputId,
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: '#94a3b8',
              strokeWidth: 1,
              opacity: 0.3,
            },
          });
        });
      }
    });

    return { nodes, edges };
  }, [metrics, inputs]);
}
