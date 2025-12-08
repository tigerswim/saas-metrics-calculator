'use client';

import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

interface MetricTooltipProps {
  formula: string;
  description: string;
  impact?: string;
}

export default function MetricTooltip({ formula, description, impact }: MetricTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none rounded-full ml-1"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-label="Show calculation details"
      >
        <InformationCircleIcon className="w-4 h-4" />
      </button>

      {isVisible && (
        <div className="absolute z-50 w-80 bg-slate-900 text-white rounded-xl shadow-2xl left-6 top-0 transform -translate-y-2 p-4 border border-slate-700">
          {/* Arrow */}
          <div className="absolute left-0 top-3 transform -translate-x-1.5 rotate-45 w-3 h-3 bg-slate-900 border-l border-t border-slate-700"></div>

          {/* Formula Section */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1.5">
              Calculation
            </div>
            <div className="text-sm font-mono bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
              {formula}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-2">
            <div className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1.5">
              What It Means
            </div>
            <div className="text-sm text-slate-200 leading-relaxed">
              {description}
            </div>
          </div>

          {/* Impact Section */}
          {impact && (
            <div className="pt-2 border-t border-slate-700">
              <div className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1.5">
                Why It Matters
              </div>
              <div className="text-sm text-slate-200 leading-relaxed">
                {impact}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
