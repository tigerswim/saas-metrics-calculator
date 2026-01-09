'use client';

import { MetricStatus } from '../utils/metricsMapUtils';
import MetricTooltip from './MetricTooltip';
import { getMetricDefinition } from '../utils/metricDefinitions';
import Sparkline from './Sparkline';

interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  status: MetricStatus;
  tooltip?: string;
  formula?: string;
  onClick?: () => void;
  className?: string;
  timeSeriesData?: number[];
  changePercent?: number | null;
  showSparkline?: boolean;
}

export default function MetricCard({
  id,
  label,
  value,
  status,
  tooltip,
  formula,
  onClick,
  className = '',
  timeSeriesData,
  changePercent,
  showSparkline = false,
}: MetricCardProps) {
  const statusColors = {
    good: 'border-emerald-500 bg-emerald-50',
    warning: 'border-amber-500 bg-amber-50',
    bad: 'border-rose-500 bg-rose-50',
  };

  const statusTextColors = {
    good: 'text-emerald-700',
    warning: 'text-amber-700',
    bad: 'text-rose-700',
  };

  const definition = getMetricDefinition(label);

  return (
    <div
      id={id}
      className={`relative border-2 rounded-lg p-3 min-w-[140px] transition-all ${
        statusColors[status]
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
    >

      {/* Label */}
      <div className="flex items-center gap-1 mb-1">
        <div className={`text-xs font-medium ${statusTextColors[status]}`}>
          {label}
        </div>
        {(definition || tooltip) && (
          <MetricTooltip
            formula={definition?.formula || formula || ''}
            description={definition?.description || tooltip || ''}
            impact={definition?.impact}
          />
        )}
      </div>

      {/* Value */}
      <div className={`text-lg font-semibold tabular-nums ${statusTextColors[status]}`}>
        {value}
      </div>

      {/* Change indicator */}
      {changePercent !== undefined && changePercent !== null && !isNaN(changePercent) && (
        <div className="flex items-center gap-1 mt-1">
          {changePercent >= 0 ? (
            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span className={`text-xs font-medium ${
            changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {Math.abs(changePercent).toFixed(1)}%
          </span>
        </div>
      )}

      {/* Sparkline */}
      {showSparkline && timeSeriesData && timeSeriesData.length > 0 && (
        <div className="mt-2 -mx-1">
          <Sparkline
            data={timeSeriesData}
            width={120}
            height={24}
            color={status === 'good' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444'}
            showArea={true}
          />
        </div>
      )}
    </div>
  );
}

