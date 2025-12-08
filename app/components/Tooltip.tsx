'use client';

import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface TooltipProps {
  content: string;
}

export default function Tooltip({ content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="More information"
      >
        <InformationCircleIcon className="w-4 h-4" />
      </button>

      {isVisible && (
        <div className="absolute z-50 w-64 px-3 py-2 text-sm text-white bg-slate-800 rounded-lg shadow-lg left-6 top-0 transform -translate-y-2">
          <div className="absolute left-0 top-2 transform -translate-x-1 rotate-45 w-2 h-2 bg-slate-800"></div>
          {content}
        </div>
      )}
    </div>
  );
}
