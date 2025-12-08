'use client';

import { useState, useRef, useEffect } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

interface MetricTooltipProps {
  formula: string;
  description: string;
  impact?: string;
}

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export default function MetricTooltip({ formula, description, impact }: MetricTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>('right');
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // 80 * 4 (w-80)
      const tooltipHeight = 280; // Estimated height with all sections
      const margin = 16; // Safety margin

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate available space in each direction
      const spaceRight = viewportWidth - rect.right;
      const spaceLeft = rect.left;
      const spaceTop = rect.top;
      const spaceBottom = viewportHeight - rect.bottom;

      // Determine best position based on available space
      let bestPosition: TooltipPosition = 'top'; // Default to top as safest

      // Prefer right if there's enough space
      if (spaceRight >= tooltipWidth + margin) {
        bestPosition = 'right';
      }
      // Otherwise prefer left if there's space
      else if (spaceLeft >= tooltipWidth + margin) {
        bestPosition = 'left';
      }
      // If neither horizontal direction works, use vertical
      else if (spaceTop >= tooltipHeight + margin) {
        bestPosition = 'top';
      }
      else if (spaceBottom >= tooltipHeight + margin) {
        bestPosition = 'bottom';
      }
      // If still nothing works, force top (will show but may need scroll)
      else {
        bestPosition = 'top';
      }

      setPosition(bestPosition);
    }
  }, [isVisible]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
      default:
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5 border-b border-r';
      case 'bottom':
        return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 border-t border-l';
      case 'left':
        return 'right-0 top-1/2 -translate-y-1/2 translate-x-1.5 border-t border-r';
      case 'right':
      default:
        return 'left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 border-l border-b';
    }
  };

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
          className={`absolute z-50 w-80 bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-slate-700 ${getPositionClasses()}`}
          style={{ maxHeight: '80vh', overflowY: 'auto' }}
        >
          {/* Arrow */}
          <div
            className={`absolute w-3 h-3 bg-slate-900 border-slate-700 rotate-45 ${getArrowClasses()}`}
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
