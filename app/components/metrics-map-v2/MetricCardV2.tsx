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
}: MetricCardV2Props) {
  const statusColors = {
    good: 'border-emerald-500',
    warning: 'border-amber-500',
    bad: 'border-rose-500',
    neutral: 'border-slate-300',
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
        relative bg-white rounded-lg shadow-sm border-l-4 z-10
        max-w-[200px]
        ${statusBorderColor}
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
      <div className="p-4">
        {/* Header - Label and Info Icon */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1 flex-1">
            <h4 className="text-sm font-medium text-slate-700 leading-tight">
              {label}
            </h4>
            {tooltip && (
              <div className="group relative">
                <InformationCircleIcon className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
                <div className="absolute left-0 top-6 hidden group-hover:block z-50 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-lg">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Value Display */}
        <div className="mb-2">
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">
            {value}
          </div>
        </div>

        {/* Bottom Section - Sparkline and Change */}
        {(sparklineData || changePercent !== undefined) && (
          <div className="flex items-end justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
            {/* Sparkline */}
            {sparklineData && sparklineData.length > 0 && (
              <div className="flex-shrink-0">
                <svg
                  width="40"
                  height="20"
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
              </div>
            )}

            {/* Change Percent Badge */}
            {changePercent !== undefined && (
              <div
                className={`
                  text-xs font-medium px-2 py-0.5 rounded
                  ${changeColor}
                  ${changePercent > 0 ? 'bg-emerald-50' : ''}
                  ${changePercent < 0 ? 'bg-rose-50' : ''}
                  ${changePercent === 0 ? 'bg-slate-50' : ''}
                `}
              >
                {changePercent > 0 ? '+' : ''}
                {changePercent.toFixed(1)}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected indicator - just enhance the existing ring */}
    </motion.div>
  );
}
