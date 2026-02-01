'use client';

import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface MetricCardV2Props {
  id: string;
  label: string;
  value: string | number;
  status?: 'good' | 'warning' | 'bad' | 'neutral';
  sparklineData?: number[];
  changePercent?: number;
  layerGradient?: string;
  isSelected?: boolean;
  opacity?: number;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
  isPrimary?: boolean; // For larger, more prominent cards
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
}

export default function MetricCardV2({
  id,
  label,
  value,
  status = 'neutral',
  sparklineData,
  changePercent,
  layerGradient,
  isSelected = false,
  opacity = 1.0,
  onClick,
  className = '',
  tooltip,
  isPrimary = false,
  efficiencyMetric,
  efficiencyMetrics,
}: MetricCardV2Props) {
  // Use efficiencyMetrics if provided, otherwise wrap single efficiencyMetric
  const metricsToDisplay = efficiencyMetrics || (efficiencyMetric ? [efficiencyMetric] : []);
  const statusColors = {
    good: 'border-emerald-500',
    warning: 'border-amber-500',
    bad: 'border-rose-500 shadow-[0_0_0_1px_rgba(244,63,94,0.15)] ring-1 ring-rose-100',
    neutral: 'border-slate-300',
  };

  const statusBgColors = {
    good: 'bg-emerald-50/30',
    warning: 'bg-amber-50/40',
    bad: 'bg-rose-50/40',
    neutral: 'bg-white',
  };

  const statusDotColors = {
    good: 'bg-emerald-500',
    warning: 'bg-amber-500',
    bad: 'bg-rose-500',
    neutral: 'bg-slate-400',
  };

  const statusBadgeColors = {
    good: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    bad: 'bg-rose-100 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const statusLabels = {
    good: 'Good',
    warning: 'At Risk',
    bad: 'Poor',
    neutral: '',
  };

  const statusBorderColor = statusColors[status];

  // Generate SVG sparkline path
  const generateSparklinePath = (data: number[]): string => {
    if (!data || data.length === 0) return '';

    const width = 40;
    const height = 20;
    const padding = 2;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = padding + (1 - (value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const changeColor = changePercent
    ? changePercent > 0
      ? 'text-emerald-600'
      : changePercent < 0
      ? 'text-rose-600'
      : 'text-slate-500'
    : 'text-slate-500';

  return (
    <motion.div
      id={id}
      className={`
        relative rounded-lg shadow-sm border-l-[6px] z-10
        w-full max-w-[180px] h-[88px]
        ${statusBorderColor}
        ${statusBgColors[status]}
        ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-200
        hover:shadow-md
        ${className}
      `}
      style={{
        opacity: Math.max(opacity, 0.4), // Never go below 40% opacity
        filter: opacity < 1 ? 'saturate(0.5)' : 'saturate(1)',
      }}
      initial={false}
      animate={{
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      onClick={onClick}
    >
      <div className="p-2 flex flex-col h-full">
        {/* Header - Label - Fixed height */}
        <div className="h-6 flex items-start justify-between mb-1">
          <h4 className="text-[11px] font-semibold text-slate-700 leading-tight">
            {label}
          </h4>
          {tooltip && (
            <div className="group relative flex-shrink-0">
              <InformationCircleIcon className="w-3 h-3 text-slate-400 hover:text-blue-600 cursor-help transition-colors" />
              <div className="absolute left-0 top-4 hidden group-hover:block z-50 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-xl">
                <div className="font-medium mb-0.5">{label}</div>
                <div className="text-slate-300 text-[11px] leading-snug">{tooltip}</div>
              </div>
            </div>
          )}
        </div>

        {/* Value Display - Fixed height */}
        <div className="h-6 flex items-center mb-1">
          <div className="text-lg font-bold text-slate-900 tabular-nums leading-none">
            {value}
          </div>
        </div>

        {/* Sparkline and Change Percent - Fixed height - ALWAYS RENDERED */}
        <div className="h-4 flex items-center justify-between gap-1 mb-1">
          {/* Sparkline - or empty space if no data */}
          <div className="flex-shrink-0">
            {sparklineData && sparklineData.length > 0 ? (
              <svg
                width="28"
                height="12"
                className="text-slate-400"
                style={{ overflow: 'visible' }}
              >
                <path
                  d={generateSparklinePath(sparklineData)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="w-7 h-3"></div>
            )}
          </div>

          {/* Change Percent Badge - or empty space if no data */}
          {changePercent !== undefined ? (
            <div
              className={`
                text-[9px] font-semibold px-1 py-0.5 rounded
                ${changeColor}
                ${changePercent > 0 ? 'bg-emerald-50' : ''}
                ${changePercent < 0 ? 'bg-rose-50' : ''}
                ${changePercent === 0 ? 'bg-slate-50' : ''}
              `}
            >
              {changePercent > 0 ? '+' : ''}
              {changePercent.toFixed(1)}%
            </div>
          ) : (
            <div className="w-12 h-4"></div>
          )}
        </div>

        {/* Status Badge - Always at bottom */}
        <div className="mt-auto pt-1 flex justify-end">
          {status !== 'neutral' && statusLabels[status] && (
            <div className={`px-1 py-0.5 rounded text-[8px] font-bold border ${statusBadgeColors[status]}`}>
              {statusLabels[status]}
            </div>
          )}
        </div>
      </div>

      {/* Selected indicator - just enhance the existing ring */}
    </motion.div>
  );
}
