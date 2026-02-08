'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { getDirectConnections } from '../../utils/metricsGraph';
import { getMetricFormula } from '../../utils/metricFormulas';
import { getMetricTargetLabel } from '../../utils/metricTargets';
import { useState } from 'react';

interface RelationshipPanelProps {
  isOpen: boolean;
  metricId: string | null;
  metricLabel: string;
  metricValue: string;
  onClose: () => void;
  isMobile?: boolean;
  efficiencyMetric?: {
    label: string;
    value: string;
    status?: 'good' | 'warning' | 'bad' | 'neutral';
  };
}

export default function RelationshipPanel({
  isOpen,
  metricId,
  metricLabel,
  metricValue,
  onClose,
  isMobile = false,
  efficiencyMetric,
}: RelationshipPanelProps) {
  const [showFormula, setShowFormula] = useState(false);

  if (!metricId) return null;

  const connections = getDirectConnections(metricId);
  const formulaData = getMetricFormula(metricId);

  // Get efficiency metric ID for target lookup
  const efficiencyMetricId = efficiencyMetric ? {
    'CPM': 'cpm',
    'CPC': 'cpc',
    'Cost/Lead': 'cost-per-lead',
    'Cost/MQL': 'cost-per-mql',
    'Cost/SQL': 'cost-per-sql',
  }[efficiencyMetric.label] : null;

  // Map metric IDs to human-readable labels
  // In a real implementation, this would come from a centralized mapping
  const getMetricLabel = (id: string): string => {
    const labelMap: Record<string, string> = {
      // Budget
      'sales-marketing-spend': 'S&M Spend',
      'marketing-spend': 'Marketing Spend',
      'sales-spend': 'Sales Spend',
      'rd-spend': 'R&D Spend',
      'ga-spend': 'G&A Spend',
      // Marketing Activities
      'paid-search': 'Paid Search',
      'paid-social': 'Paid Social',
      'events': 'Events',
      'content': 'Content Marketing',
      'partnerships': 'Partnerships',
      'abm': 'ABM',
      'impressions': 'Impressions',
      'clicks': 'Clicks',
      'leads': 'Leads',
      'mqls': 'MQLs',
      'sqls': 'SQLs',
      'opportunities': 'Opportunities',
      'deals-won': 'Deals Won',
      'new-bookings': 'New Bookings',
      'new-customers-added': 'New Customers',
      'expansion-arr': 'Expansion ARR',
      'churned-arr': 'Churned ARR',
      'net-new-arr': 'Net New ARR',
      'ending-arr': 'Ending ARR',
      'cac-blended': 'CAC (Blended)',
      'ltv': 'LTV',
      'ltv-cac-ratio': 'LTV:CAC Ratio',
      'cac-payback-period': 'CAC Payback',
      'magic-number': 'Magic Number',
      'quick-ratio': 'Quick Ratio',
      'rule-of-40': 'Rule of 40',
      'arr-growth-rate': 'ARR Growth Rate',
      'ebitda-margin': 'EBITDA Margin',
      // Add more as needed
    };

    return labelMap[id] || id;
  };

  const panelVariants = isMobile
    ? {
        hidden: { y: '100%' },
        visible: { y: 0 },
        exit: { y: '100%' },
      }
    : {
        hidden: { x: '100%' },
        visible: { x: 0 },
        exit: { x: '100%' },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-slate-900/10 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={`
              fixed z-50 bg-white shadow-2xl
              ${isMobile
                ? 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[60vh]'
                : 'top-0 right-0 bottom-0 w-full max-w-md border-l border-slate-200'
              }
              overflow-y-auto
            `}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {metricLabel}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mt-1 tabular-nums">
                  {metricValue}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close panel"
              >
                <XMarkIcon className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-6">
              {/* Driven By Section */}
              {connections.inputs.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                    Driven By
                  </h4>
                  <div className="space-y-2">
                    {connections.inputs.map((inputId) => (
                      <div
                        key={inputId}
                        className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <ChevronRightIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-900">
                          {getMetricLabel(inputId)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Influences Section */}
              {connections.outputs.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                    Influences
                  </h4>
                  <div className="space-y-2">
                    {connections.outputs.map((outputId) => (
                      <div
                        key={outputId}
                        className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                      >
                        <ChevronRightIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-900">
                          {getMetricLabel(outputId)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Target Section */}
              {getMetricTargetLabel(metricId) && (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                      Performance Target
                    </h4>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {getMetricTargetLabel(metricId)}
                  </p>
                </div>
              )}

              {/* Efficiency Metric Section */}
              {efficiencyMetric && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
                    Efficiency Metric
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">{efficiencyMetric.label}</span>
                    <span className="text-lg font-bold text-slate-900">{efficiencyMetric.value}</span>
                  </div>
                  {efficiencyMetricId && getMetricTargetLabel(efficiencyMetricId) && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-slate-600">Target:</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {getMetricTargetLabel(efficiencyMetricId)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Formula Section */}
              <div>
                <button
                  onClick={() => setShowFormula(!showFormula)}
                  className="w-full text-left p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      How is this calculated?
                    </span>
                    <motion.div
                      animate={{ rotate: showFormula ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRightIcon className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {showFormula && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        {formulaData ? (
                          <>
                            <div className="font-mono text-sm text-slate-900 mb-2 p-2 bg-white rounded border border-slate-200">
                              {formulaData.formula}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {formulaData.description}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-500">
                            Formula not available for this metric.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Definition Section */}
              {formulaData && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                    Why This Matters
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {formulaData.description}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
