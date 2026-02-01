'use client';

import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  FunnelIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BanknotesIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

interface LayerHeaderProps {
  layer: 'budget' | 'activities' | 'acquisition' | 'revenue' | 'outcomes';
  title: string;
  description: string;
  gradientClass: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  metricCount?: number;
}

const layerIcons = {
  budget: BanknotesIcon,
  activities: MegaphoneIcon,
  acquisition: FunnelIcon,
  revenue: ChartBarIcon,
  outcomes: PresentationChartLineIcon,
};

export default function LayerHeader({
  layer,
  title,
  description,
  gradientClass,
  isExpanded = true,
  onToggle,
  isMobile = false,
  metricCount,
}: LayerHeaderProps) {
  const Icon = layerIcons[layer];

  if (isMobile) {
    // Mobile: Accordion trigger
    return (
      <motion.button
        className={`
          w-full flex items-center justify-between px-4 py-3
          ${gradientClass} text-white
          rounded-lg shadow-sm
          transition-all duration-200
          ${isExpanded ? 'mb-4' : 'mb-2'}
        `}
        onClick={onToggle}
        initial={false}
        animate={{
          marginBottom: isExpanded ? '16px' : '8px',
        }}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold text-base">{title}</div>
            <div className="text-xs text-white/80">{description}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {metricCount !== undefined && (
            <div className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded">
              {metricCount}
            </div>
          )}
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </div>
      </motion.button>
    );
  }

  // Desktop: Visual separator
  return (
    <div className={`${gradientClass} rounded-lg px-6 py-3 mb-4 shadow-sm`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-white" />
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/90">{description}</p>
        </div>
      </div>
    </div>
  );
}
