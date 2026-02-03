'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface NodeData {
  label: string;
  value: string;
  tier: string;
  status: 'good' | 'warning' | 'bad' | 'neutral';
  sparklineData?: number[];
  changePercent?: number;
}

const PrimaryNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as NodeData;
  const statusColors = {
    good: 'border-emerald-500 bg-emerald-50',
    warning: 'border-amber-500 bg-amber-50',
    bad: 'border-rose-500 bg-rose-50',
    neutral: 'border-slate-300 bg-white',
  };

  const tierGradients = {
    budget: 'from-slate-700 to-slate-500',
    activities: 'from-blue-700 to-blue-500',
    acquisition: 'from-teal-700 to-cyan-500',
    revenue: 'from-green-700 to-emerald-500',
    outcomes: 'from-purple-700 to-indigo-500',
  };

  return (
    <div
      className={`
        relative
        px-5 py-4
        rounded-lg
        border-2
        ${statusColors[nodeData.status]}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        shadow-md
        hover:shadow-lg
        transition-shadow
        min-w-[200px]
        max-w-[240px]
      `}
    >
      {/* Tier indicator bar - thicker for primary */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${tierGradients[nodeData.tier as keyof typeof tierGradients]} rounded-t-lg`} />

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-slate-400 border-2 border-white"
      />

      {/* Content */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {nodeData.label}
        </div>
        <div className="text-2xl font-bold text-slate-900">
          {nodeData.value}
        </div>

        {/* Sparkline placeholder - can be enhanced later */}
        {nodeData.sparklineData && (
          <div className="h-8 flex items-end gap-0.5">
            {nodeData.sparklineData.slice(-8).map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-slate-300 rounded-t"
                style={{
                  height: `${(val / Math.max(...nodeData.sparklineData!)) * 100}%`,
                  minHeight: '2px',
                }}
              />
            ))}
          </div>
        )}

        {/* Change percent badge */}
        {nodeData.changePercent !== undefined && (
          <div className={`
            text-xs font-medium
            ${nodeData.changePercent > 0 ? 'text-emerald-600' : 'text-rose-600'}
          `}>
            {nodeData.changePercent > 0 ? '↑' : '↓'} {Math.abs(nodeData.changePercent).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-slate-400 border-2 border-white"
      />

      {/* Status indicator - larger for primary */}
      {nodeData.status !== 'neutral' && (
        <div className={`
          absolute bottom-2 right-2
          w-3 h-3 rounded-full
          ${nodeData.status === 'good' ? 'bg-emerald-500' : ''}
          ${nodeData.status === 'warning' ? 'bg-amber-500' : ''}
          ${nodeData.status === 'bad' ? 'bg-rose-500' : ''}
          shadow-sm
        `} />
      )}
    </div>
  );
});

PrimaryNode.displayName = 'PrimaryNode';

export default PrimaryNode;
