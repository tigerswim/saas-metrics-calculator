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
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search metrics..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('executive')}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md transition-colors
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
              px-3 py-1.5 text-sm font-medium rounded-md transition-colors
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">Layers:</span>
            {layers.map(layer => (
              <button
                key={layer.id}
                onClick={() => onLayerToggle(layer.id)}
                className={`
                  px-2 py-1 text-xs font-medium rounded border transition-colors
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
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onFitView}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Fit to view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Help text */}
      <div className="mt-2 text-xs text-slate-500">
        {viewMode === 'executive'
          ? 'Executive view shows key outcomes and efficiency metrics. Switch to Builder mode to see all layers.'
          : 'Builder view shows all metrics. Click nodes to explore relationships.'
        }
      </div>
    </div>
  );
}
