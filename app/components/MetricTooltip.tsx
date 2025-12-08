'use client';

import { useState, useRef, useEffect } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

interface MetricTooltipProps {
  formula: string;
  description: string;
  impact?: string;
}

export default function MetricTooltip({ formula, description, impact }: MetricTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'right' | 'top'>('right');
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Check if there's enough space on the right for the tooltip (need ~320px)
      const spaceOnRight = viewportWidth - rect.right;

      // Check if we're in the bottom half of the viewport
      const isBottomHalf = rect.top > viewportHeight / 2;

      // If not enough space on right or in bottom half, show tooltip on top
      if (spaceOnRight < 350 || isBottomHalf) {
        setPosition('top');
      } else {
        setPosition('right');
      }
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none rounded-full ml-1"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-label="Show calculation details"
      >
        <InformationCircleIcon className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 w-80 bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-slate-700 ${
            position === 'top'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
              : 'left-6 top-0 -translate-y-2'
          }`}
        >
          {/* Arrow */}
          <div
            className={`absolute w-3 h-3 bg-slate-900 border-slate-700 rotate-45 ${
              position === 'top'
                ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5 border-b border-r'
                : 'left-0 top-3 -translate-x-1.5 border-l border-t'
            }`}
          />

          {/* Formula Section */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1.5">
              Calculation
            </div>
            <div className="text-sm font-mono bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 break-words">
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
