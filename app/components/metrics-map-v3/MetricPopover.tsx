'use client';

import { motion } from 'framer-motion';
import { XMarkIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { getDirectConnections } from '../../utils/metricsGraph';
import { getMetricFormula } from '../../utils/metricFormulas';
import { getMetricTargetLabel } from '../../utils/metricTargets';
import { useState } from 'react';

interface MetricPopoverProps {
  isOpen: boolean;
  position: { x: number; y: number; placement: 'right' | 'left' | 'top' | 'bottom' } | null;
  metricId: string | null;
  metricLabel: string;
  metricValue: string;
  onClose: () => void;
}

export function MetricPopover({
  isOpen,
  position,
  metricId,
  metricLabel,
  metricValue,
  onClose,
}: MetricPopoverProps) {
  const [showFormula, setShowFormula] = useState(false);

  // Early return if not open or no position
  if (!isOpen || !position || !metricId) return null;

  const connections = getDirectConnections(metricId);
  const formulaData = getMetricFormula(metricId);

  // Map metric IDs to human-readable labels
  const getMetricLabelFromId = (id: string): string => {
    const labelMap: Record<string, string> = {
      // Budget
      'sales-marketing-spend': 'S&M Spend',
      'marketing-spend': 'Marketing Spend',
      'sales-spend': 'Sales Spend',
      'rd-spend': 'R&D Spend',
      'ga-spend': 'G&A Spend',
      'total-opex': 'Total OpEx',
      // Marketing Activities
      'paid-search': 'Paid Search',
      'paid-social': 'Paid Social',
      'events': 'Events',
      'content': 'Content Marketing',
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
      'new-bookings': 'New Bookings',
      'new-customers-added': 'New Customers',
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
      'cac-blended': 'CAC (Blended)',
      'cac-paid-only': 'CAC (Paid)',
      'ltv': 'LTV',
      'ltv-cac-ratio': 'LTV:CAC Ratio',
      'cac-payback-period': 'CAC Payback',
      'payback-period-sm': 'S&M Payback',
      'magic-number': 'Magic Number',
      'quick-ratio': 'Quick Ratio',
      'rule-of-40': 'Rule of 40',
      'burn-multiple': 'Burn Multiple',
      'gross-margin': 'Gross Margin',
      'gross-profit': 'Gross Profit',
      'ebitda': 'EBITDA',
      'ebitda-margin': 'EBITDA Margin',
    };

    return labelMap[id] || id;
  };

  // Placement-based arrow styles
  const arrowStyles = {
    right: {
      container: 'left-0 top-8 transform -translate-x-full',
      arrow: 'border-l-white border-t-transparent border-b-transparent border-r-transparent border-l-8 border-t-8 border-b-8',
    },
    left: {
      container: 'right-0 top-8 transform translate-x-full',
      arrow: 'border-r-white border-t-transparent border-b-transparent border-l-transparent border-r-8 border-t-8 border-b-8',
    },
    top: {
      container: 'bottom-0 left-8 transform translate-y-full',
      arrow: 'border-b-white border-l-transparent border-r-transparent border-t-transparent border-b-8 border-l-8 border-r-8',
    },
    bottom: {
      container: 'top-0 left-8 transform -translate-y-full',
      arrow: 'border-t-white border-l-transparent border-r-transparent border-b-transparent border-t-8 border-l-8 border-r-8',
    },
  };

  const currentArrow = arrowStyles[position.placement];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="fixed bg-white rounded-lg shadow-xl border border-slate-200"
      style={{
        left: position.x,
        top: position.y,
        maxWidth: '320px',
        maxHeight: '80vh',
        overflow: 'auto',
        zIndex: 60,
      }}
      role="dialog"
      aria-labelledby="popover-title"
    >
      {/* Arrow pointer */}
      <div className={`absolute w-0 h-0 ${currentArrow.container}`}>
        <div className={currentArrow.arrow} />
      </div>

      {/* Header - compact */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-3 py-2 flex justify-between items-start">
        <div className="flex-1 pr-2">
          <h3 id="popover-title" className="text-sm font-semibold text-slate-900 leading-tight">
            {metricLabel}
          </h3>
          <p className="text-xl font-bold text-blue-600 mt-0.5 tabular-nums">
            {metricValue}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-0.5 rounded hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Content - compact */}
      <div className="px-3 py-3 space-y-3 text-xs">
        {/* Driven By Section */}
        {connections.inputs.length > 0 && (
          <section>
            <h4 className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <span>📥</span> Driven By
            </h4>
            <div className="space-y-1">
              {connections.inputs.map((inputId) => (
                <div
                  key={inputId}
                  className="flex items-center gap-1.5 p-1.5 bg-blue-50 rounded border border-blue-100"
                >
                  <ChevronRightIcon className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-900 truncate">
                    {getMetricLabelFromId(inputId)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Influences Section */}
        {connections.outputs.length > 0 && (
          <section>
            <h4 className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <span>📤</span> Influences
            </h4>
            <div className="space-y-1">
              {connections.outputs.map((outputId) => (
                <div
                  key={outputId}
                  className="flex items-center gap-1.5 p-1.5 bg-emerald-50 rounded border border-emerald-100"
                >
                  <ChevronRightIcon className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-900 truncate">
                    {getMetricLabelFromId(outputId)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Performance Target Section */}
        {getMetricTargetLabel(metricId) && (
          <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-semibold text-emerald-700">
                Target
              </h4>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {getMetricTargetLabel(metricId)}
            </p>
          </div>
        )}

        {/* Formula Section - collapsible */}
        {formulaData && (
          <div>
            <button
              onClick={() => setShowFormula(!showFormula)}
              className="w-full text-left p-2 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Formula
                </span>
                <ChevronRightIcon
                  className={`w-3 h-3 text-slate-400 transition-transform ${
                    showFormula ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </button>
            {showFormula && formulaData && (
              <div className="mt-1.5 p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-xs font-mono text-slate-700 mb-1.5">
                  {formulaData.formula}
                </div>
                {formulaData.description && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {formulaData.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Why This Matters */}
        {formulaData?.description && !showFormula && (
          <section>
            <h4 className="text-xs font-semibold text-slate-600 mb-1">
              Why This Matters
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {formulaData.description}
            </p>
          </section>
        )}
      </div>
    </motion.div>
  );
}
