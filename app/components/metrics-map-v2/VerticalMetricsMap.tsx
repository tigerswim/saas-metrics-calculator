'use client';

import { useState, useEffect, useMemo } from 'react';
import { CalculatedMetrics, Inputs } from '../../types';
import {
  getTwoDegreesOfConnections,
  getMetricOpacity,
  getMetricLayer,
} from '../../utils/metricsGraph';
import MetricCardV2 from './MetricCardV2';
import LayerHeader from './LayerHeader';
import RelationshipPanel from './RelationshipPanel';
import MetricsConnections from './MetricsConnections';
import { formatMetricValue } from '../../utils/metricsMapUtils';
import {
  generateAllTimeSeriesData,
  calculateWoWChange,
} from '../../utils/timeSeriesData';
import { getCalculatedMetricStatus } from '../../utils/metricTargets';

interface VerticalMetricsMapProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

interface FocusState {
  selectedMetricId: string | null;
  primary: string[];
  secondary: string[];
}

export default function VerticalMetricsMap({ metrics, inputs }: VerticalMetricsMapProps) {
  const [focusState, setFocusState] = useState<FocusState>({
    selectedMetricId: null,
    primary: [],
    secondary: [],
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(
    new Set(['budget', 'activities', 'acquisition', 'revenue', 'outcomes'])
  );

  // Generate time series data for sparklines (memoized to prevent recalculation)
  const timeSeriesData = useMemo(
    () => generateAllTimeSeriesData(metrics, inputs),
    [metrics.endingARR, metrics.netNewARR, metrics.ltv, metrics.cacBlended] // Only recalculate when key metrics change
  );

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle metric card click
  const handleMetricClick = (metricId: string) => {
    if (focusState.selectedMetricId === metricId) {
      // Clicking the same metric - exit focus mode
      setFocusState({
        selectedMetricId: null,
        primary: [],
        secondary: [],
      });
      setIsPanelOpen(false);
    } else {
      // Enter focus mode for this metric
      const connections = getTwoDegreesOfConnections(metricId);
      setFocusState({
        selectedMetricId: metricId,
        primary: connections.primary,
        secondary: connections.secondary,
      });
      setIsPanelOpen(true);
    }
  };

  // Handle ESC key to exit focus mode
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFocusState({
          selectedMetricId: null,
          primary: [],
          secondary: [],
        });
        setIsPanelOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Toggle layer expansion (mobile only)
  const toggleLayer = (layer: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layer)) {
      newExpanded.delete(layer);
    } else {
      newExpanded.add(layer);
    }
    setExpandedLayers(newExpanded);
  };

  // Define layer configurations
  const layers = [
    {
      id: 'budget',
      title: 'Operating Budget',
      description: 'Major budget categories and organizational spend',
      gradientClass: 'bg-gradient-to-r from-slate-700 to-slate-500',
    },
    {
      id: 'activities',
      title: 'Marketing Activities',
      description: 'Marketing channels and programs that drive demand',
      gradientClass: 'bg-gradient-to-r from-blue-700 to-blue-500',
    },
    {
      id: 'acquisition',
      title: 'Acquisition Funnel',
      description: 'How you acquire customers - complete conversion flow',
      gradientClass: 'bg-gradient-to-r from-teal-700 to-cyan-500',
    },
    {
      id: 'revenue',
      title: 'Revenue & Retention',
      description: 'How revenue is generated and retained',
      gradientClass: 'bg-gradient-to-r from-green-700 to-emerald-500',
    },
    {
      id: 'outcomes',
      title: 'Business Outcomes',
      description: 'Unit economics and financial performance',
      gradientClass: 'bg-gradient-to-r from-purple-700 to-indigo-500',
    },
  ];

  // Complete metrics for each layer
  type MetricCard = {
    id: string;
    label: string;
    value: string;
    sparklineData?: number[];
    changePercent?: number;
    status?: 'good' | 'warning' | 'bad' | 'neutral';
    isPrimary?: boolean;
    efficiencyMetric?: {
      label: string;
      value: string;
      status?: 'good' | 'warning' | 'bad' | 'neutral';
    };
    efficiencyMetrics?: Array<{
      label: string;
      value: string;
      status?: 'good' | 'warning' | 'bad' | 'neutral';
    }>;
  };

  const layerMetrics: Record<string, MetricCard[] | Record<string, MetricCard[]>> = {
    budget: [
      {
        id: 'sales-marketing-spend',
        label: 'S&M Spend',
        value: `$${(inputs.totalSalesMarketing * 1000).toLocaleString()}`,
      },
      {
        id: 'marketing-spend',
        label: 'Marketing Spend',
        value: `$${((inputs.paidSearchSpend + inputs.paidSocialSpend + inputs.eventsSpend + inputs.contentSpend + inputs.partnershipsSpend + inputs.abmSpend) * 1000).toLocaleString()}`,
      },
      {
        id: 'sales-spend',
        label: 'Sales Spend',
        value: `$${((inputs.totalSalesMarketing - (inputs.paidSearchSpend + inputs.paidSocialSpend + inputs.eventsSpend + inputs.contentSpend + inputs.partnershipsSpend + inputs.abmSpend)) * 1000).toLocaleString()}`,
      },
      {
        id: 'rd-spend',
        label: 'R&D Spend',
        value: `$${(inputs.rdSpend * 1000).toLocaleString()}`,
      },
      {
        id: 'ga-spend',
        label: 'G&A Spend',
        value: `$${(inputs.gaSpend * 1000).toLocaleString()}`,
      },
    ],
    activities: [
      {
        id: 'paid-search',
        label: 'Paid Search',
        value: `$${(inputs.paidSearchSpend * 1000).toLocaleString()}`,
      },
      {
        id: 'paid-social',
        label: 'Paid Social',
        value: `$${(inputs.paidSocialSpend * 1000).toLocaleString()}`,
      },
      {
        id: 'events',
        label: 'Events',
        value: `$${(inputs.eventsSpend * 1000).toLocaleString()}`,
      },
      {
        id: 'content',
        label: 'Content Marketing',
        value: `$${(inputs.contentSpend * 1000).toLocaleString()}`,
      },
      {
        id: 'partnerships',
        label: 'Partnerships',
        value: `$${(inputs.partnershipsSpend * 1000).toLocaleString()}`,
      },
      {
        id: 'abm',
        label: 'ABM',
        value: `$${(inputs.abmSpend * 1000).toLocaleString()}`,
      },
    ],
    acquisition: [
      // Funnel Flow - Main Volume Metrics
      {
        id: 'impressions',
        label: 'Impressions',
        value: inputs.paidImpressions.toLocaleString(),
        isPrimary: true,
        efficiencyMetric: {
          label: 'CPM',
          value: `$${metrics.cpm.toFixed(2)}`,
          status: getCalculatedMetricStatus('cpm', metrics, inputs),
        },
      },
      {
        id: 'clicks',
        label: 'Clicks',
        value: inputs.paidClicks.toLocaleString(),
        sparklineData: timeSeriesData.paidClicks,
        changePercent: calculateWoWChange(timeSeriesData.paidClicks) ?? undefined,
        isPrimary: true,
        efficiencyMetrics: [
          {
            label: 'CPC',
            value: `$${metrics.cpc.toFixed(2)}`,
            status: getCalculatedMetricStatus('cpc', metrics, inputs),
          },
          {
            label: 'CTR',
            value: `${metrics.ctr.toFixed(2)}%`,
            status: getCalculatedMetricStatus('ctr', metrics, inputs),
          },
        ],
      },
      {
        id: 'leads',
        label: 'Leads',
        value: inputs.leadsGenerated.toLocaleString(),
        sparklineData: timeSeriesData.leadsGenerated,
        changePercent: calculateWoWChange(timeSeriesData.leadsGenerated) ?? undefined,
      },
      {
        id: 'mqls',
        label: 'MQLs',
        value: inputs.mqlsGenerated.toLocaleString(),
        sparklineData: timeSeriesData.mqlsGenerated,
        changePercent: calculateWoWChange(timeSeriesData.mqlsGenerated) ?? undefined,
        isPrimary: true,
        efficiencyMetric: {
          label: 'Cost/MQL',
          value: `$${metrics.costPerMQL.toFixed(0)}`,
          status: getCalculatedMetricStatus('cost-per-mql', metrics, inputs),
        },
      },
      {
        id: 'sqls',
        label: 'SQLs',
        value: metrics.sqlsGenerated.toLocaleString(),
        isPrimary: true,
        efficiencyMetric: {
          label: 'Cost/SQL',
          value: `$${metrics.costPerSQL.toFixed(0)}`,
          status: getCalculatedMetricStatus('cost-per-sql', metrics, inputs),
        },
      },
      {
        id: 'opportunities',
        label: 'Opportunities',
        value: metrics.opportunitiesCreated.toLocaleString(),
      },
      {
        id: 'deals-won',
        label: 'Deals Won',
        value: metrics.dealsClosedWon.toLocaleString(),
        sparklineData: timeSeriesData.dealsClosedWon,
        changePercent: calculateWoWChange(timeSeriesData.dealsClosedWon) ?? undefined,
      },
      // Pipeline Metrics
      {
        id: 'pipeline-generated',
        label: 'Pipeline Value',
        value: formatMetricValue('pipelineGenerated', metrics.pipelineGenerated, metrics, inputs),
      },
      {
        id: 'pipeline-velocity',
        label: 'Pipeline Velocity',
        value: `$${Math.round(metrics.pipelineVelocity).toLocaleString()}/day`,
      },
    ],
    revenue: {
      // Left Column: New Customer Revenue
      newRevenue: [
        {
          id: 'new-customers-added',
          label: 'New Customers',
          value: inputs.newCustomersAdded.toLocaleString(),
        },
        {
          id: 'new-bookings',
          label: 'New Bookings',
          value: formatMetricValue('newBookings', metrics.newBookings, metrics, inputs),
          sparklineData: timeSeriesData.newBookings,
          changePercent: calculateWoWChange(timeSeriesData.newBookings) ?? undefined,
        },
      ],
      // Center Column: ARR Waterfall
      waterfall: [
        {
          id: 'beginning-arr',
          label: 'Beginning ARR',
          value: `$${(inputs.beginningARR).toFixed(1)}M`,
        },
        {
          id: 'net-new-arr',
          label: 'Net New ARR',
          value: formatMetricValue('netNewARR', metrics.netNewARR, metrics, inputs),
          sparklineData: timeSeriesData.netNewARR,
          changePercent: calculateWoWChange(timeSeriesData.netNewARR) ?? undefined,
        },
        {
          id: 'ending-arr',
          label: 'Ending ARR',
          value: formatMetricValue('endingARR', metrics.endingARR * 1000, metrics, inputs),
          sparklineData: timeSeriesData.endingARR,
          changePercent: calculateWoWChange(timeSeriesData.endingARR) ?? undefined,
        },
        {
          id: 'mrr',
          label: 'MRR',
          value: `$${Math.round(metrics.mrr * 1000).toLocaleString()}`,
        },
        {
          id: 'arr-growth-rate',
          label: 'ARR Growth',
          value: `${metrics.annualizedGrowthRate.toFixed(1)}%`,
        },
      ],
      // Right Column: Existing Customer Performance
      existing: [
        {
          id: 'expansion-arr',
          label: 'Expansion ARR',
          value: formatMetricValue('expansionARR', inputs.expansionARR, metrics, inputs),
          sparklineData: timeSeriesData.expansionARR,
          changePercent: calculateWoWChange(timeSeriesData.expansionARR) ?? undefined,
        },
        {
          id: 'churned-arr',
          label: 'Churned ARR',
          value: formatMetricValue('churnedARR', inputs.churnedARR, metrics, inputs),
          sparklineData: timeSeriesData.churnedARR,
          changePercent: calculateWoWChange(timeSeriesData.churnedARR) ?? undefined,
        },
        {
          id: 'annualized-grr',
          label: 'GRR (Annual)',
          value: `${metrics.annualizedGRR.toFixed(0)}%`,
          status: getCalculatedMetricStatus('annualized-grr', metrics, inputs),
        },
        {
          id: 'annualized-nrr',
          label: 'NRR (Annual)',
          value: `${metrics.annualizedNRR.toFixed(0)}%`,
          status: getCalculatedMetricStatus('annualized-nrr', metrics, inputs),
        },
        {
          id: 'logo-churn-rate',
          label: 'Logo Churn',
          value: `${metrics.logoChurnRate.toFixed(1)}%`,
          status: getCalculatedMetricStatus('logo-churn-rate', metrics, inputs),
        },
        {
          id: 'customers-churned',
          label: 'Customers Churned',
          value: inputs.customersChurned.toLocaleString(),
        },
        {
          id: 'ending-customer-count',
          label: 'Total Customers',
          value: metrics.endingCustomerCount.toLocaleString(),
        },
        {
          id: 'arpa',
          label: 'ARPA',
          value: `$${metrics.arpa.toLocaleString()}`,
        },
      ],
    },
    outcomes: {
      // Left Column: KPI Percentages
      kpiPercent: [
        {
          id: 'gross-margin',
          label: 'Gross Margin',
          value: `${metrics.grossMargin.toFixed(1)}%`,
          status: getCalculatedMetricStatus('gross-margin', metrics, inputs),
        },
        {
          id: 'ebitda-margin',
          label: 'EBITDA Margin',
          value: `${metrics.ebitdaMargin.toFixed(1)}%`,
          status: getCalculatedMetricStatus('ebitda-margin', metrics, inputs),
        },
        {
          id: 'rule-of-40',
          label: 'Rule of 40',
          value: formatMetricValue('ruleOf40', metrics.ruleOf40, metrics, inputs),
          sparklineData: timeSeriesData.ruleOf40,
          changePercent: calculateWoWChange(timeSeriesData.ruleOf40) ?? undefined,
          status: getCalculatedMetricStatus('rule-of-40', metrics, inputs),
        },
      ],
      // Center Column: P&L Performance
      pnl: [
        {
          id: 'gross-profit',
          label: 'Gross Profit',
          value: `$${Math.round(metrics.grossProfit * 1000).toLocaleString()}`,
        },
        {
          id: 'total-opex',
          label: 'Total OpEx',
          value: `$${Math.round(metrics.totalOpEx * 1000).toLocaleString()}`,
        },
        {
          id: 'ebitda',
          label: 'EBITDA',
          value: `$${Math.round(metrics.ebitda * 1000).toLocaleString()}`,
        },
      ],
      // Right Column: KPI Absolute Measures
      kpiAbsolute: [
        // Unit Economics
        {
          id: 'cac-blended',
          label: 'CAC (Blended)',
          value: formatMetricValue('cacBlended', metrics.cacBlended, metrics, inputs),
          status: getCalculatedMetricStatus('cac-blended', metrics, inputs),
        },
        {
          id: 'ltv',
          label: 'LTV',
          value: formatMetricValue('ltv', metrics.ltv, metrics, inputs),
          status: getCalculatedMetricStatus('ltv', metrics, inputs),
        },
        // Efficiency Ratios
        {
          id: 'ltv-cac-ratio',
          label: 'LTV:CAC Ratio',
          value: formatMetricValue('ltvCacRatio', metrics.ltvCacRatio, metrics, inputs),
          sparklineData: timeSeriesData.ltvCacRatio,
          changePercent: calculateWoWChange(timeSeriesData.ltvCacRatio) ?? undefined,
          status: getCalculatedMetricStatus('ltv-cac-ratio', metrics, inputs),
        },
        {
          id: 'magic-number',
          label: 'Magic Number',
          value: formatMetricValue('magicNumber', metrics.magicNumber, metrics, inputs),
          sparklineData: timeSeriesData.magicNumber,
          changePercent: calculateWoWChange(timeSeriesData.magicNumber) ?? undefined,
          status: getCalculatedMetricStatus('magic-number', metrics, inputs),
        },
        {
          id: 'quick-ratio',
          label: 'Quick Ratio',
          value: formatMetricValue('saasQuickRatio', metrics.saasQuickRatio, metrics, inputs),
          sparklineData: timeSeriesData.saasQuickRatio,
          changePercent: calculateWoWChange(timeSeriesData.saasQuickRatio) ?? undefined,
          status: getCalculatedMetricStatus('quick-ratio', metrics, inputs),
        },
        {
          id: 'burn-multiple',
          label: 'Burn Multiple',
          value: `${metrics.burnMultiple.toFixed(1)}x`,
          status: getCalculatedMetricStatus('burn-multiple', metrics, inputs),
        },
        // Time-based Measures
        {
          id: 'cac-payback-period',
          label: 'CAC Payback',
          value: `${metrics.cacPaybackPeriod.toFixed(1)} mo`,
          status: getCalculatedMetricStatus('cac-payback-period', metrics, inputs),
        },
      ],
    },
  };

  // Get the selected metric's label, value, and efficiency metric for the panel
  const selectedMetricInfo = (() => {
    if (!focusState.selectedMetricId) {
      return { label: '', value: '', efficiencyMetric: undefined };
    }

    // Search through all layers to find the metric
    for (const layer of Object.values(layerMetrics)) {
      // Handle nested objects (revenue and outcomes have sub-arrays)
      if (layer && typeof layer === 'object' && !Array.isArray(layer)) {
        for (const subArray of Object.values(layer)) {
          if (Array.isArray(subArray)) {
            const metric = subArray.find((m: any) => m.id === focusState.selectedMetricId);
            if (metric) {
              return {
                label: metric.label,
                value: metric.value,
                efficiencyMetric: metric.efficiencyMetric,
              };
            }
          }
        }
      } else if (Array.isArray(layer)) {
        // Handle flat arrays (budget and activities)
        const metric = layer.find(m => m.id === focusState.selectedMetricId);
        if (metric) {
          return {
            label: metric.label,
            value: metric.value,
            efficiencyMetric: metric.efficiencyMetric,
          };
        }
      }
    }

    return { label: focusState.selectedMetricId, value: '-', efficiencyMetric: undefined };
  })();

  // Define visual connections between metrics with conversion rates
  const clickToLeadRate = inputs.paidClicks > 0
    ? ((inputs.leadsGenerated / inputs.paidClicks) * 100).toFixed(1)
    : '0.0';

  const connections = [
    // Budget → Activities: Marketing Spend breaks down into channels
    { from: 'marketing-spend', to: 'paid-search', label: '% Share' },
    { from: 'marketing-spend', to: 'paid-social', label: '% Share' },
    { from: 'marketing-spend', to: 'events', label: '% Share' },
    { from: 'marketing-spend', to: 'content', label: '% Share' },
    { from: 'marketing-spend', to: 'partnerships', label: '% Share' },
    { from: 'marketing-spend', to: 'abm', label: '% Share' },

    // Activities → Acquisition: Marketing activities drive demand
    { from: 'paid-search', to: 'impressions', label: 'Drive' },
    { from: 'paid-social', to: 'impressions', label: 'Drive' },

    // Acquisition funnel flow - routed through conversion rate cards
    // Impressions → CTR → Clicks
    { from: 'impressions', to: 'ctr' },
    { from: 'ctr', to: 'clicks' },

    // Clicks → Click→Lead → Leads
    { from: 'clicks', to: 'click-to-lead-rate' },
    { from: 'click-to-lead-rate', to: 'leads' },

    // Leads → Lead→MQL → MQLs
    { from: 'leads', to: 'lead-to-mql-rate' },
    { from: 'lead-to-mql-rate', to: 'mqls' },

    // MQLs → MQL→SQL → SQLs
    { from: 'mqls', to: 'mql-to-sql-rate' },
    { from: 'mql-to-sql-rate', to: 'sqls' },

    // SQLs → SQL→Opp → Opportunities
    { from: 'sqls', to: 'sql-to-opp-rate' },
    { from: 'sql-to-opp-rate', to: 'opportunities' },

    // Opportunities → Win Rate → Deals Won
    { from: 'opportunities', to: 'win-rate' },
    { from: 'win-rate', to: 'deals-won' },

    // Efficiency metric connections (right column)
    { from: 'impressions', to: 'cpm' },
    { from: 'clicks', to: 'cpc' },
    { from: 'mqls', to: 'cost-per-mql' },
    { from: 'sqls', to: 'cost-per-sql' },

    // Pipeline metrics connections
    // pipelineGenerated = opportunities × avgDealSize
    { from: 'opportunities', to: 'pipeline-generated' },
    // pipelineVelocity = (opportunities × avgDealSize × winRate) / salesCycle
    { from: 'opportunities', to: 'pipeline-velocity' },
    // Acquisition → Revenue
    { from: 'deals-won', to: 'new-customers-added' },
    // newBookings = newCustomersAdded × avgDealSize
    { from: 'new-customers-added', to: 'new-bookings' },

    // Revenue flow - waterfall connections
    // netNewARR = newBookings + expansionARR - churnedARR
    { from: 'new-bookings', to: 'net-new-arr' },
    { from: 'expansion-arr', to: 'net-new-arr' },
    { from: 'churned-arr', to: 'net-new-arr' },
    // endingARR = beginningARR + netNewARR
    { from: 'beginning-arr', to: 'ending-arr' },
    { from: 'net-new-arr', to: 'ending-arr' },
    // mrr = endingARR / 12
    { from: 'ending-arr', to: 'mrr' },
    // arrGrowthRate calculated from netNewARR / beginningARR
    { from: 'net-new-arr', to: 'arr-growth-rate' },
    { from: 'beginning-arr', to: 'arr-growth-rate' },

    // Existing customer performance connections
    // annualizedGRR derived from churned-arr and beginning-arr
    { from: 'churned-arr', to: 'annualized-grr' },
    // annualizedNRR derived from expansion-arr, churned-arr, and beginning-arr
    { from: 'expansion-arr', to: 'annualized-nrr' },
    { from: 'churned-arr', to: 'annualized-nrr' },
    // logoChurnRate = customersChurned / totalCustomers (inputs only)

    // arpa = (endingARR / totalCustomers) / 12 (monthly)
    { from: 'ending-arr', to: 'arpa' },

    // Revenue → Business Outcomes (KPI % column)
    // ruleOf40 = arrGrowthRate + ebitdaMargin
    { from: 'arr-growth-rate', to: 'rule-of-40' },
    { from: 'ebitda-margin', to: 'rule-of-40' },

    // Revenue → Business Outcomes (P&L column)
    // grossProfit = mrr × grossMargin
    { from: 'mrr', to: 'gross-profit' },
    { from: 'gross-margin', to: 'gross-profit' },
    // totalOpEx = totalSalesMarketing + rdSpend + gaSpend (from budget inputs)
    { from: 'sales-marketing-spend', to: 'total-opex' },
    { from: 'rd-spend', to: 'total-opex' },
    { from: 'ga-spend', to: 'total-opex' },
    // ebitda = grossProfit - totalOpEx
    { from: 'gross-profit', to: 'ebitda' },
    { from: 'total-opex', to: 'ebitda' },

    // Revenue → Business Outcomes (Efficiency column)
    // ltv = arpa × avgCustomerLifetime
    { from: 'arpa', to: 'ltv' },
    // cacBlended = totalSalesMarketing / newCustomersAdded
    { from: 'sales-marketing-spend', to: 'cac-blended' },
    { from: 'new-customers-added', to: 'cac-blended' },
    // magicNumber = netNewARR / totalSalesMarketing
    { from: 'net-new-arr', to: 'magic-number' },
    { from: 'sales-marketing-spend', to: 'magic-number' },
    // quickRatio = (newBookings + expansionARR) / churnedARR
    { from: 'new-bookings', to: 'quick-ratio' },
    { from: 'expansion-arr', to: 'quick-ratio' },
    { from: 'churned-arr', to: 'quick-ratio' },
    // burnMultiple = abs(ebitda) / netNewARR (when EBITDA < 0)
    { from: 'ebitda', to: 'burn-multiple' },
    { from: 'net-new-arr', to: 'burn-multiple' },

    // Business Outcomes: Within Efficiency column
    // ltvCacRatio = ltv / cacBlended
    { from: 'ltv', to: 'ltv-cac-ratio' },
    { from: 'cac-blended', to: 'ltv-cac-ratio' },
    // cacPaybackPeriod = cacBlended / (arpa × grossMargin)
    { from: 'cac-blended', to: 'cac-payback-period' },
    { from: 'arpa', to: 'cac-payback-period' },
    { from: 'gross-margin', to: 'cac-payback-period' },
  ];

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">
          Metrics Map
        </h2>
        <p className="text-sm text-slate-600">
          Click any metric to see relationships and connections
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 overflow-visible relative metrics-connections-container">
        {/* Connection lines between metrics */}
        <MetricsConnections connections={connections} focusState={focusState} />

        {/* Vertical stack of horizontal layers */}
        <div className="flex flex-col gap-12">
          {layers.map((layer) => {
          const isExpanded = expandedLayers.has(layer.id);
          const layerData = layerMetrics[layer.id];
          const layerMetricsList = Array.isArray(layerData) ? layerData : [];

          return (
            <div key={layer.id} className="mb-8 last:mb-0">
              <LayerHeader
                layer={layer.id as any}
                title={layer.title}
                description={layer.description}
                gradientClass={layer.gradientClass}
                isExpanded={isExpanded}
                onToggle={() => toggleLayer(layer.id)}
                isMobile={isMobile}
                metricCount={layerMetricsList.length}
              />

              {/* Layer-specific rendering */}
              {(!isMobile || isExpanded) && (
                <>
                  {/* Acquisition: Vertical three-column layout */}
                  {layer.id === 'acquisition' && (
                    <div className="space-y-6">
                      {/* Main funnel: three-column grid - all cards same size */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start max-w-4xl mx-auto">

                        {/* Row 1: Impressions */}
                        <div className="hidden md:block"></div>
                        <MetricCardV2
                          id="impressions"
                          label="Impressions"
                          value={inputs.paidImpressions.toLocaleString()}
                          status={getCalculatedMetricStatus('impressions', metrics, inputs)}
                          sparklineData={timeSeriesData.impressions}
                          changePercent={calculateWoWChange(timeSeriesData.impressions) ?? undefined}
                          className="md:justify-self-center"
                          onClick={() => handleMetricClick('impressions')}
                          isSelected={focusState.selectedMetricId === 'impressions'}
                          opacity={getMetricOpacity('impressions', focusState)}
                        />
                        <MetricCardV2
                          id="cpm"
                          label="CPM"
                          value={`$${metrics.cpm.toFixed(2)}`}
                          status={getCalculatedMetricStatus('cpm', metrics, inputs)}
                          className="md:justify-self-start"
                          onClick={() => handleMetricClick('cpm')}
                          isSelected={focusState.selectedMetricId === 'cpm'}
                          opacity={getMetricOpacity('cpm', focusState)}
                        />

                        {/* Row 2: Clicks */}
                        <MetricCardV2
                          id="ctr"
                          label="CTR"
                          value={`${metrics.ctr.toFixed(2)}%`}
                          status={getCalculatedMetricStatus('ctr', metrics, inputs)}
                          className="md:justify-self-end"
                          onClick={() => handleMetricClick('ctr')}
                          isSelected={focusState.selectedMetricId === 'ctr'}
                          opacity={getMetricOpacity('ctr', focusState)}
                        />
                        <MetricCardV2
                          id="clicks"
                          label="Clicks"
                          value={inputs.paidClicks.toLocaleString()}
                          status={getCalculatedMetricStatus('clicks', metrics, inputs)}
                          sparklineData={timeSeriesData.paidClicks}
                          changePercent={calculateWoWChange(timeSeriesData.paidClicks) ?? undefined}
                          className="md:justify-self-center"
                          onClick={() => handleMetricClick('clicks')}
                          isSelected={focusState.selectedMetricId === 'clicks'}
                          opacity={getMetricOpacity('clicks', focusState)}
                        />
                        <MetricCardV2
                          id="cpc"
                          label="CPC"
                          value={`$${metrics.cpc.toFixed(2)}`}
                          status={getCalculatedMetricStatus('cpc', metrics, inputs)}
                          className="md:justify-self-start"
                          onClick={() => handleMetricClick('cpc')}
                          isSelected={focusState.selectedMetricId === 'cpc'}
                          opacity={getMetricOpacity('cpc', focusState)}
                        />

                        {/* Row 3: Leads */}
                        <MetricCardV2
                          id="click-to-lead-rate"
                          label="Click→Lead"
                          value={`${metrics.clickToLeadRate.toFixed(1)}%`}
                          status={getCalculatedMetricStatus('click-to-lead-rate', metrics, inputs)}
                          className="md:justify-self-end"
                          onClick={() => handleMetricClick('click-to-lead-rate')}
                          isSelected={focusState.selectedMetricId === 'click-to-lead-rate'}
                          opacity={getMetricOpacity('click-to-lead-rate', focusState)}
                        />
                        <MetricCardV2
                          id="leads"
                          label="Leads"
                          value={inputs.leadsGenerated.toLocaleString()}
                          status={getCalculatedMetricStatus('leads', metrics, inputs)}
                          sparklineData={timeSeriesData.leadsGenerated}
                          changePercent={calculateWoWChange(timeSeriesData.leadsGenerated) ?? undefined}
                          className="md:justify-self-center"
                          onClick={() => handleMetricClick('leads')}
                          isSelected={focusState.selectedMetricId === 'leads'}
                          opacity={getMetricOpacity('leads', focusState)}
                        />
                        {/* Row 4: MQLs */}
                        <MetricCardV2
                          id="lead-to-mql-rate"
                          label="Lead→MQL"
                          value={`${metrics.leadToMQLRate.toFixed(1)}%`}
                          status={getCalculatedMetricStatus('lead-to-mql-rate', metrics, inputs)}
                          className="md:justify-self-end"
                          onClick={() => handleMetricClick('lead-to-mql-rate')}
                          isSelected={focusState.selectedMetricId === 'lead-to-mql-rate'}
                          opacity={getMetricOpacity('lead-to-mql-rate', focusState)}
                        />
                        <MetricCardV2
                          id="mqls"
                          label="MQLs"
                          value={inputs.mqlsGenerated.toLocaleString()}
                          status={getCalculatedMetricStatus('mqls', metrics, inputs)}
                          sparklineData={timeSeriesData.mqlsGenerated}
                          changePercent={calculateWoWChange(timeSeriesData.mqlsGenerated) ?? undefined}
                          className="md:justify-self-center"
                          onClick={() => handleMetricClick('mqls')}
                          isSelected={focusState.selectedMetricId === 'mqls'}
                          opacity={getMetricOpacity('mqls', focusState)}
                        />
                        <MetricCardV2
                          id="cost-per-mql"
                          label="Cost/MQL"
                          value={`$${Math.round(metrics.costPerMQL).toLocaleString()}`}
                          status={getCalculatedMetricStatus('cost-per-mql', metrics, inputs)}
                          className="md:justify-self-start"
                          onClick={() => handleMetricClick('cost-per-mql')}
                          isSelected={focusState.selectedMetricId === 'cost-per-mql'}
                          opacity={getMetricOpacity('cost-per-mql', focusState)}
                        />

                        {/* Row 5: SQLs */}
                        <MetricCardV2
                          id="mql-to-sql-rate"
                          label="MQL→SQL"
                          value={`${inputs.mqlToSQLConversion}%`}
                          status="neutral"
                          className="md:justify-self-end"
                          onClick={() => handleMetricClick('mql-to-sql-rate')}
                          isSelected={focusState.selectedMetricId === 'mql-to-sql-rate'}
                          opacity={getMetricOpacity('mql-to-sql-rate', focusState)}
                        />
                        <MetricCardV2
                          id="sqls"
                          label="SQLs"
                          value={metrics.sqlsGenerated.toLocaleString()}
                          status={getCalculatedMetricStatus('sqls', metrics, inputs)}
                          sparklineData={timeSeriesData.sqlsGenerated}
                          changePercent={calculateWoWChange(timeSeriesData.sqlsGenerated) ?? undefined}
                          className="md:justify-self-center"
                          onClick={() => handleMetricClick('sqls')}
                          isSelected={focusState.selectedMetricId === 'sqls'}
                          opacity={getMetricOpacity('sqls', focusState)}
                        />
                        <MetricCardV2
                          id="cost-per-sql"
                          label="Cost/SQL"
                          value={`$${Math.round(metrics.costPerSQL).toLocaleString()}`}
                          status={getCalculatedMetricStatus('cost-per-sql', metrics, inputs)}
                          className="md:justify-self-start"
                          onClick={() => handleMetricClick('cost-per-sql')}
                          isSelected={focusState.selectedMetricId === 'cost-per-sql'}
                          opacity={getMetricOpacity('cost-per-sql', focusState)}
                        />

                        {/* Row 6: Opportunities */}
                        <MetricCardV2
                          id="sql-to-opp-rate"
                          label="SQL→Opp"
                          value={`${inputs.sqlToOppConversion}%`}
                          status="neutral"
                          className="md:justify-self-end"
                          onClick={() => handleMetricClick('sql-to-opp-rate')}
                          isSelected={focusState.selectedMetricId === 'sql-to-opp-rate'}
                          opacity={getMetricOpacity('sql-to-opp-rate', focusState)}
                        />
                        <MetricCardV2
                          id="opportunities"
                          label="Opportunities"
                          value={metrics.opportunitiesCreated.toLocaleString()}
                          status={getCalculatedMetricStatus('opportunities', metrics, inputs)}
                          sparklineData={timeSeriesData.opportunitiesCreated}
                          changePercent={calculateWoWChange(timeSeriesData.opportunitiesCreated) ?? undefined}
                          className="md:justify-self-center"
                          onClick={() => handleMetricClick('opportunities')}
                          isSelected={focusState.selectedMetricId === 'opportunities'}
                          opacity={getMetricOpacity('opportunities', focusState)}
                        />
                        <div className="hidden md:block"></div>

                        {/* Row 7: Deals Won */}
                        <MetricCardV2
                          id="win-rate"
                          label="Win Rate"
                          value={`${inputs.winRate}%`}
                          status="neutral"
                          className="md:justify-self-end"
                          onClick={() => handleMetricClick('win-rate')}
                          isSelected={focusState.selectedMetricId === 'win-rate'}
                          opacity={getMetricOpacity('win-rate', focusState)}
                        />
                        <MetricCardV2
                          id="deals-won"
                          label="Deals Won"
                          value={metrics.dealsClosedWon.toLocaleString()}
                          status={getCalculatedMetricStatus('deals-won', metrics, inputs)}
                          sparklineData={timeSeriesData.dealsClosedWon}
                          changePercent={calculateWoWChange(timeSeriesData.dealsClosedWon) ?? undefined}
                          className="md:justify-self-center"
                          onClick={() => handleMetricClick('deals-won')}
                          isSelected={focusState.selectedMetricId === 'deals-won'}
                          opacity={getMetricOpacity('deals-won', focusState)}
                        />
                        <div className="hidden md:block"></div>
                      </div>

                      {/* Pipeline metrics: horizontal row at bottom */}
                      <div className="flex gap-3 justify-center flex-wrap">
                        <MetricCardV2
                          id="pipeline-generated"
                          label="Pipeline Value"
                          value={`$${(metrics.pipelineGenerated / 1000).toFixed(1)}M`}
                          status={getCalculatedMetricStatus('pipeline-generated', metrics, inputs)}
                          onClick={() => handleMetricClick('pipeline-generated')}
                          isSelected={focusState.selectedMetricId === 'pipeline-generated'}
                          opacity={getMetricOpacity('pipeline-generated', focusState)}
                        />
                        <MetricCardV2
                          id="pipeline-velocity"
                          label="Pipeline Velocity"
                          value={`$${Math.round(metrics.pipelineVelocity).toLocaleString()}/day`}
                          status={getCalculatedMetricStatus('pipeline-velocity', metrics, inputs)}
                          onClick={() => handleMetricClick('pipeline-velocity')}
                          isSelected={focusState.selectedMetricId === 'pipeline-velocity'}
                          opacity={getMetricOpacity('pipeline-velocity', focusState)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Revenue: Three-column layout (New | Waterfall | Existing) */}
                  {layer.id === 'revenue' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] gap-3 items-start max-w-6xl mx-auto">
                        {/* Left Column: New Customer Revenue */}
                        <div className="space-y-3">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">New</div>
                          {(layerMetrics[layer.id] as any).newRevenue.map((metric: any) => (
                            <MetricCardV2
                              key={metric.id}
                              id={metric.id}
                              label={metric.label}
                              value={metric.value}
                              status={metric.status || 'neutral'}
                              sparklineData={metric.sparklineData}
                              changePercent={metric.changePercent}
                              isSelected={focusState.selectedMetricId === metric.id}
                              opacity={getMetricOpacity(metric.id, focusState)}
                              onClick={() => handleMetricClick(metric.id)}
                            />
                          ))}
                        </div>

                        {/* Center Column: ARR Waterfall */}
                        <div className="space-y-3">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">ARR Waterfall</div>
                          {(layerMetrics[layer.id] as any).waterfall.map((metric: any) => (
                            <MetricCardV2
                              key={metric.id}
                              id={metric.id}
                              label={metric.label}
                              value={metric.value}
                              status={metric.status || 'neutral'}
                              sparklineData={metric.sparklineData}
                              changePercent={metric.changePercent}
                              isSelected={focusState.selectedMetricId === metric.id}
                              opacity={getMetricOpacity(metric.id, focusState)}
                              onClick={() => handleMetricClick(metric.id)}
                            />
                          ))}
                        </div>

                        {/* Right Column: Existing Customer Performance */}
                        <div className="space-y-3">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Existing</div>
                          {(layerMetrics[layer.id] as any).existing.map((metric: any) => (
                            <MetricCardV2
                              key={metric.id}
                              id={metric.id}
                              label={metric.label}
                              value={metric.value}
                              status={metric.status || 'neutral'}
                              sparklineData={metric.sparklineData}
                              changePercent={metric.changePercent}
                              isSelected={focusState.selectedMetricId === metric.id}
                              opacity={getMetricOpacity(metric.id, focusState)}
                              onClick={() => handleMetricClick(metric.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Outcomes: Three-column layout (KPI % | P&L | KPI Absolute) */}
                  {layer.id === 'outcomes' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start max-w-6xl mx-auto">
                        {/* Left Column: KPI Percentages */}
                        <div className="space-y-3">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">KPI %</div>
                          {(layerMetrics[layer.id] as any).kpiPercent.map((metric: any) => (
                            <MetricCardV2
                              key={metric.id}
                              id={metric.id}
                              label={metric.label}
                              value={metric.value}
                              status={metric.status || 'neutral'}
                              sparklineData={metric.sparklineData}
                              changePercent={metric.changePercent}
                              isSelected={focusState.selectedMetricId === metric.id}
                              opacity={getMetricOpacity(metric.id, focusState)}
                              onClick={() => handleMetricClick(metric.id)}
                            />
                          ))}
                        </div>

                        {/* Center Column: P&L Performance */}
                        <div className="space-y-3">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">P&L</div>
                          {(layerMetrics[layer.id] as any).pnl.map((metric: any) => (
                            <MetricCardV2
                              key={metric.id}
                              id={metric.id}
                              label={metric.label}
                              value={metric.value}
                              status={metric.status || 'neutral'}
                              sparklineData={metric.sparklineData}
                              changePercent={metric.changePercent}
                              isSelected={focusState.selectedMetricId === metric.id}
                              opacity={getMetricOpacity(metric.id, focusState)}
                              onClick={() => handleMetricClick(metric.id)}
                            />
                          ))}
                        </div>

                        {/* Right Column: KPI Absolute Measures */}
                        <div className="space-y-3">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Efficiency</div>
                          {(layerMetrics[layer.id] as any).kpiAbsolute.map((metric: any) => (
                            <MetricCardV2
                              key={metric.id}
                              id={metric.id}
                              label={metric.label}
                              value={metric.value}
                              status={metric.status || 'neutral'}
                              sparklineData={metric.sparklineData}
                              changePercent={metric.changePercent}
                              isSelected={focusState.selectedMetricId === metric.id}
                              opacity={getMetricOpacity(metric.id, focusState)}
                              onClick={() => handleMetricClick(metric.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Default horizontal row for Budget, Activities */}
                  {layer.id !== 'acquisition' && layer.id !== 'revenue' && layer.id !== 'outcomes' && (
                    <div className="relative">
                      <div className={`
                        flex
                        gap-4 lg:gap-6
                        overflow-x-auto lg:overflow-visible
                        pb-4 lg:pb-0
                        scrollbar-thin-horizontal
                        snap-x snap-mandatory lg:snap-none
                        min-w-max lg:min-w-0
                      `}>
                        {layerMetricsList.map((metric) => {
                          const opacity = getMetricOpacity(metric.id, focusState);
                          const isSelected = focusState.selectedMetricId === metric.id;

                          return (
                            <div
                              key={metric.id}
                              className="flex-shrink-0 snap-start w-[280px] sm:w-auto"
                            >
                              <MetricCardV2
                                id={metric.id}
                                label={metric.label}
                                value={metric.value}
                                status={metric.status || 'neutral'}
                                sparklineData={metric.sparklineData}
                                changePercent={metric.changePercent}
                                layerGradient={layer.gradientClass}
                                isSelected={isSelected}
                                opacity={opacity}
                                onClick={() => handleMetricClick(metric.id)}
                                isPrimary={metric.isPrimary}
                                efficiencyMetric={metric.efficiencyMetric}
                                efficiencyMetrics={metric.efficiencyMetrics}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Relationship Panel */}
      <RelationshipPanel
        isOpen={isPanelOpen}
        metricId={focusState.selectedMetricId}
        metricLabel={selectedMetricInfo.label}
        metricValue={selectedMetricInfo.value}
        efficiencyMetric={selectedMetricInfo.efficiencyMetric}
        onClose={() => {
          setIsPanelOpen(false);
          setFocusState({
            selectedMetricId: null,
            primary: [],
            secondary: [],
          });
        }}
        isMobile={isMobile}
      />
    </section>
  );
}
