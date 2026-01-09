'use client';

interface MetricConnectionProps {
  fromId: string;
  toId: string;
  label?: string;
  className?: string;
}

export default function MetricConnection({
  fromId,
  toId,
  label,
  className = '',
}: MetricConnectionProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-2">
        {/* Thin line */}
        <div className="w-8 h-px bg-slate-300" />
        {/* Arrow */}
        <svg
          className="w-4 h-4 text-slate-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
        {/* Label */}
        {label && (
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

