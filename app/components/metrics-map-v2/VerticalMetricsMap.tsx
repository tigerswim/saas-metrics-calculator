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
    new Set(['activities', 'acquisition', 'revenue', 'outcomes'])
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

  // Get the selected metric's label and value for the panel
  const getSelectedMetricInfo = () => {
    if (!focusState.selectedMetricId) {
      return { label: '', value: '' };
    }

    // Map metric IDs to their values from metrics/inputs
    // This is a simplified version - expand as needed
    const metricValues: Record<string, { label: string; value: string }> = {
      'cac-blended': {
        label: 'CAC (Blended)',
        value: formatMetricValue('cacBlended', metrics.cacBlended, metrics, inputs),
      },
      'ltv-cac-ratio': {
        label: 'LTV:CAC Ratio',
        value: formatMetricValue('ltvCacRatio', metrics.ltvCacRatio, metrics, inputs),
      },
      'net-new-arr': {
        label: 'Net New ARR',
        value: formatMetricValue('netNewARR', metrics.netNewARR, metrics, inputs),
      },
      'ending-arr': {
        label: 'Ending ARR',
        value: formatMetricValue('endingARR', metrics.endingARR * 1000, metrics, inputs),
      },
      'rule-of-40': {
        label: 'Rule of 40',
        value: formatMetricValue('ruleOf40', metrics.ruleOf40, metrics, inputs),
      },
      // Add more mappings as needed
    };

    return metricValues[focusState.selectedMetricId] || { label: focusState.selectedMetricId, value: '-' };
  };

  const selectedMetricInfo = getSelectedMetricInfo();

  // Define layer configurations
  const layers = [
    {
      id: 'activities',
      title: 'Activities',
      description: 'What you do - marketing spend and sales efforts',
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

  // Sample metrics for each layer (simplified for MVP)
  // In full implementation, this would include all metrics from the design doc
  const layerMetrics: Record<string, Array<{ id: string; label: string; value: string; sparklineData?: number[]; changePercent?: number }>> = {
    activities: [
      {
        id: 'sales-marketing-spend',
        label: 'S&M Spend',
        value: `$${(inputs.totalSalesMarketing * 1000).toLocaleString()}`,
      },
    ],
    acquisition: [
      {
        id: 'impressions',
        label: 'Impressions',
        value: inputs.paidImpressions.toLocaleString(),
      },
      {
        id: 'clicks',
        label: 'Clicks',
        value: inputs.paidClicks.toLocaleString(),
        sparklineData: timeSeriesData.paidClicks,
        changePercent: calculateWoWChange(timeSeriesData.paidClicks),
      },
      {
        id: 'leads',
        label: 'Leads',
        value: inputs.leadsGenerated.toLocaleString(),
        sparklineData: timeSeriesData.leadsGenerated,
        changePercent: calculateWoWChange(timeSeriesData.leadsGenerated),
      },
      {
        id: 'mqls',
        label: 'MQLs',
        value: inputs.mqlsGenerated.toLocaleString(),
        sparklineData: timeSeriesData.mqlsGenerated,
        changePercent: calculateWoWChange(timeSeriesData.mqlsGenerated),
      },
      {
        id: 'sqls',
        label: 'SQLs',
        value: metrics.sqlsGenerated.toLocaleString(),
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
        changePercent: calculateWoWChange(timeSeriesData.dealsClosedWon),
      },
    ],
    revenue: [
      {
        id: 'new-bookings',
        label: 'New Bookings',
        value: formatMetricValue('newBookings', metrics.newBookings, metrics, inputs),
        sparklineData: timeSeriesData.newBookings,
        changePercent: calculateWoWChange(timeSeriesData.newBookings),
      },
      {
        id: 'expansion-arr',
        label: 'Expansion ARR',
        value: formatMetricValue('expansionARR', inputs.expansionARR, metrics, inputs),
        sparklineData: timeSeriesData.expansionARR,
        changePercent: calculateWoWChange(timeSeriesData.expansionARR),
      },
      {
        id: 'churned-arr',
        label: 'Churned ARR',
        value: formatMetricValue('churnedARR', inputs.churnedARR, metrics, inputs),
        sparklineData: timeSeriesData.churnedARR,
        changePercent: calculateWoWChange(timeSeriesData.churnedARR),
      },
      {
        id: 'net-new-arr',
        label: 'Net New ARR',
        value: formatMetricValue('netNewARR', metrics.netNewARR, metrics, inputs),
        sparklineData: timeSeriesData.netNewARR,
        changePercent: calculateWoWChange(timeSeriesData.netNewARR),
      },
      {
        id: 'ending-arr',
        label: 'Ending ARR',
        value: formatMetricValue('endingARR', metrics.endingARR * 1000, metrics, inputs),
        sparklineData: timeSeriesData.endingARR,
        changePercent: calculateWoWChange(timeSeriesData.endingARR),
      },
    ],
    outcomes: [
      {
        id: 'cac-blended',
        label: 'CAC (Blended)',
        value: formatMetricValue('cacBlended', metrics.cacBlended, metrics, inputs),
      },
      {
        id: 'ltv',
        label: 'LTV',
        value: formatMetricValue('ltv', metrics.ltv, metrics, inputs),
      },
      {
        id: 'ltv-cac-ratio',
        label: 'LTV:CAC Ratio',
        value: formatMetricValue('ltvCacRatio', metrics.ltvCacRatio, metrics, inputs),
        sparklineData: timeSeriesData.ltvCacRatio,
        changePercent: calculateWoWChange(timeSeriesData.ltvCacRatio),
      },
      {
        id: 'magic-number',
        label: 'Magic Number',
        value: formatMetricValue('magicNumber', metrics.magicNumber, metrics, inputs),
        sparklineData: timeSeriesData.magicNumber,
        changePercent: calculateWoWChange(timeSeriesData.magicNumber),
      },
      {
        id: 'quick-ratio',
        label: 'Quick Ratio',
        value: formatMetricValue('saasQuickRatio', metrics.saasQuickRatio, metrics, inputs),
        sparklineData: timeSeriesData.saasQuickRatio,
        changePercent: calculateWoWChange(timeSeriesData.saasQuickRatio),
      },
      {
        id: 'rule-of-40',
        label: 'Rule of 40',
        value: formatMetricValue('ruleOf40', metrics.ruleOf40, metrics, inputs),
        sparklineData: timeSeriesData.ruleOf40,
        changePercent: calculateWoWChange(timeSeriesData.ruleOf40),
      },
    ],
  };

  // Define visual connections between metrics
  const connections = [
    // Activities → Acquisition
    { from: 'sales-marketing-spend', to: 'impressions' },
    { from: 'sales-marketing-spend', to: 'leads' },

    // Acquisition flow
    { from: 'impressions', to: 'clicks', label: `${metrics.ctr.toFixed(1)}%` },
    { from: 'clicks', to: 'leads', label: 'CTL' },
    { from: 'leads', to: 'mqls', label: `${((inputs.mqlsGenerated / inputs.leadsGenerated) * 100).toFixed(0)}%` },
    { from: 'mqls', to: 'sqls', label: `${inputs.mqlToSQLConversion}%` },
    { from: 'sqls', to: 'opportunities', label: `${inputs.sqlToOppConversion}%` },
    { from: 'opportunities', to: 'deals-won', label: `${inputs.winRate}%` },

    // Acquisition → Revenue
    { from: 'deals-won', to: 'new-bookings' },

    // Revenue flow
    { from: 'new-bookings', to: 'net-new-arr' },
    { from: 'expansion-arr', to: 'net-new-arr' },
    { from: 'churned-arr', to: 'net-new-arr' },
    { from: 'net-new-arr', to: 'ending-arr' },

    // Revenue → Outcomes
    { from: 'ending-arr', to: 'ltv' },
    { from: 'sales-marketing-spend', to: 'cac-blended' },
    { from: 'new-bookings', to: 'cac-blended' },
    { from: 'ltv', to: 'ltv-cac-ratio' },
    { from: 'cac-blended', to: 'ltv-cac-ratio' },
    { from: 'net-new-arr', to: 'magic-number' },
    { from: 'net-new-arr', to: 'quick-ratio' },
    { from: 'expansion-arr', to: 'quick-ratio' },
    { from: 'ending-arr', to: 'rule-of-40' },
  ];

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">
          Metrics Map (Beta)
        </h2>
        <p className="text-sm text-slate-600">
          Click any metric to see relationships and connections
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 overflow-visible relative metrics-connections-container">
        {/* Connection lines between metrics */}
        <MetricsConnections connections={connections} focusState={focusState} />

        {layers.map((layer) => {
          const isExpanded = expandedLayers.has(layer.id);
          const metrics = layerMetrics[layer.id] || [];

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
                metricCount={metrics.length}
              />

              {/* Metrics Grid - show if expanded or not mobile */}
              {(!isMobile || isExpanded) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {metrics.map((metric) => {
                    const opacity = getMetricOpacity(metric.id, focusState);
                    const isSelected = focusState.selectedMetricId === metric.id;

                    return (
                      <MetricCardV2
                        key={metric.id}
                        id={metric.id}
                        label={metric.label}
                        value={metric.value}
                        status="neutral"
                        sparklineData={metric.sparklineData}
                        changePercent={metric.changePercent}
                        layerGradient={layer.gradientClass}
                        isSelected={isSelected}
                        opacity={opacity}
                        onClick={() => handleMetricClick(metric.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Relationship Panel */}
      <RelationshipPanel
        isOpen={isPanelOpen}
        metricId={focusState.selectedMetricId}
        metricLabel={selectedMetricInfo.label}
        metricValue={selectedMetricInfo.value}
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
