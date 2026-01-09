'use client';

interface ConnectionArrowProps {
  fromId: string;
  toId: string;
  label?: string;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  className?: string;
}

export default function ConnectionArrow({
  fromId,
  toId,
  label,
  direction = 'horizontal',
  className = '',
}: ConnectionArrowProps) {
  // This component will be positioned absolutely based on the actual card positions
  // For now, we'll create a flexible arrow that can be positioned via CSS
  const getArrowPath = () => {
    switch (direction) {
      case 'horizontal':
        return 'M 0 0 L 100 0';
      case 'vertical':
        return 'M 0 0 L 0 100';
      case 'diagonal':
        return 'M 0 0 L 100 100';
      default:
        return 'M 0 0 L 100 0';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
          </marker>
        </defs>
        <path
          d={getArrowPath()}
          stroke="#64748b"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      </svg>
      {label && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded text-xs text-slate-600 font-medium whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}

// Alternative simpler arrow component using CSS
export function SimpleArrow({
  fromId,
  toId,
  label,
  className = '',
}: {
  fromId: string;
  toId: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {label && (
        <span className="text-xs text-slate-500 font-medium mr-2 whitespace-nowrap">
          {label}
        </span>
      )}
      <svg
        className="w-6 h-6 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
}

