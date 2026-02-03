'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface NodeData {
  label: string;
  value: string;
  tier: string;
  status: 'good' | 'warning' | 'bad' | 'neutral';
}

const StandardNode = memo(({ data, selected }: NodeProps) => {
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
        px-4 py-3
        rounded-lg
        border-2
        ${statusColors[nodeData.status]}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        shadow-sm
        hover:shadow-md
        transition-shadow
        min-w-[160px]
        max-w-[200px]
      `}
    >
      {/* Tier indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierGradients[nodeData.tier as keyof typeof tierGradients]} rounded-t-lg`} />

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-slate-400 border-2 border-white"
      />

      {/* Content */}
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          {nodeData.label}
        </div>
        <div className="text-lg font-semibold text-slate-900">
          {nodeData.value}
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-slate-400 border-2 border-white"
      />

      {/* Status indicator */}
      {nodeData.status !== 'neutral' && (
        <div className={`
          absolute bottom-1 right-1
          w-2 h-2 rounded-full
          ${nodeData.status === 'good' ? 'bg-emerald-500' : ''}
          ${nodeData.status === 'warning' ? 'bg-amber-500' : ''}
          ${nodeData.status === 'bad' ? 'bg-rose-500' : ''}
        `} />
      )}
    </div>
  );
});

StandardNode.displayName = 'StandardNode';

export default StandardNode;
