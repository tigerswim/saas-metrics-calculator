'use client';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  className?: string;
}

export default function Sparkline({
  data,
  width = 60,
  height = 20,
  color = '#64748b',
  showArea = true,
  className = '',
}: SparklineProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Normalize data to fit within the SVG viewBox
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Avoid division by zero

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = [
    `0,${height}`,
    ...points.split(' '),
    `${width},${height}`,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
    >
      {showArea && (
        <polygon
          points={areaPoints}
          fill={color}
          fillOpacity="0.2"
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

