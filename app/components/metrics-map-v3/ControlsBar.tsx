'use client';

import { useState, useCallback } from 'react';

interface ControlsBarProps {
  viewMode: 'executive' | 'builder';
  onViewModeChange: (mode: 'executive' | 'builder') => void;
  visibleLayers: Set<string>;
  onLayerToggle: (layer: string) => void;
  onSearch: (query: string) => void;
  onReset: () => void;
  onFitView: () => void;
}

export default function ControlsBar({
  viewMode,
  onViewModeChange,
  visibleLayers,
  onLayerToggle,
  onSearch,
  onReset,
  onFitView,
}: ControlsBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  }, [onSearch]);

  const layers = [
    { id: 'budget', label: 'Budget', color: 'slate' },
    { id: 'activities', label: 'Activities', color: 'blue' },
    { id: 'acquisition', label: 'Acquisition', color: 'teal' },
    { id: 'revenue', label: 'Revenue', color: 'green' },
    { id: 'outcomes', label: 'Outcomes', color: 'purple' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-md order-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search metrics..."
            className="w-full px-3 py-2.5 sm:py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 order-2">
          <button
            onClick={() => onViewModeChange('executive')}
            className={`
              px-3 py-2 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-[44px] sm:min-h-0 flex items-center
              ${viewMode === 'executive'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }
            `}
          >
            Executive
          </button>
          <button
            onClick={() => onViewModeChange('builder')}
            className={`
              px-3 py-2 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-[44px] sm:min-h-0 flex items-center
              ${viewMode === 'builder'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }
            `}
          >
            Builder
          </button>
        </div>

        {/* Layer Toggles (only in Builder mode) */}
        {viewMode === 'builder' && (
          <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 order-4 sm:order-3">
            <span className="text-xs font-medium text-slate-500 mr-1 whitespace-nowrap">Layers:</span>
            {layers.map(layer => (
              <button
                key={layer.id}
                onClick={() => onLayerToggle(layer.id)}
                className={`
                  px-3 py-2 sm:px-2 sm:py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap min-h-[44px] sm:min-h-0 flex items-center
                  ${visibleLayers.has(layer.id)
                    ? `bg-${layer.color}-50 border-${layer.color}-500 text-${layer.color}-700`
                    : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                  }
                `}
                style={{
                  backgroundColor: visibleLayers.has(layer.id) ? `rgb(var(--${layer.color}-50))` : 'white',
                  borderColor: visibleLayers.has(layer.id) ? `rgb(var(--${layer.color}-500))` : '#cbd5e1',
                  color: visibleLayers.has(layer.id) ? `rgb(var(--${layer.color}-700))` : '#64748b',
                }}
              >
                {layer.label}
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto order-3 sm:order-4">
          <button
            onClick={onFitView}
            className="p-3 sm:px-3 sm:py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors min-w-[44px] min-h-[44px] sm:min-h-0 flex items-center justify-center"
            title="Fit to view"
            aria-label="Fit to view"
          >
            <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button
            onClick={onReset}
            className="p-3 sm:px-3 sm:py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors min-w-[44px] min-h-[44px] sm:min-h-0 flex items-center justify-center"
            title="Reset view"
            aria-label="Reset view"
          >
            <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Help text */}
      <div className="mt-2 text-xs sm:text-xs text-slate-500">
        {viewMode === 'executive'
          ? 'Executive view shows key outcomes and efficiency metrics. Switch to Builder mode to see all layers.'
          : 'Builder view shows all metrics. Click nodes to explore relationships.'
        }
      </div>
    </div>
  );
}
