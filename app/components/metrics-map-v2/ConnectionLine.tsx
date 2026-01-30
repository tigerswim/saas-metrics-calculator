'use client';

import { motion } from 'framer-motion';

interface ConnectionLineProps {
  fromId: string;
  toId: string;
  label?: string;
  color?: string;
  opacity?: number;
  animated?: boolean;
  strokeWidth?: number;
}

export default function ConnectionLine({
  fromId,
  toId,
  label,
  color = '#64748b',
  opacity = 1.0,
  animated = true,
  strokeWidth = 2,
}: ConnectionLineProps) {
  // Note: In the actual implementation, we need to calculate positions
  // based on the actual DOM positions of the metric cards.
  // For now, this is a placeholder structure.

  // This component will be enhanced with position calculation logic
  // when integrated into VerticalMetricsMap

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <marker
          id={`arrowhead-${fromId}-${toId}`}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill={color}
            opacity={opacity}
          />
        </marker>
      </defs>

      <motion.path
        d="" // Will be calculated based on actual card positions
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#arrowhead-${fromId}-${toId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        transition={{ duration: 0.3 }}
        style={{
          strokeDasharray: animated ? '5 5' : undefined,
          animation: animated ? 'flow 3s linear infinite' : undefined,
        }}
      />

      {/* Label on connection */}
      {label && (
        <motion.text
          x="0" // Will be calculated
          y="0" // Will be calculated
          className="text-xs fill-slate-600"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          transition={{ duration: 0.3 }}
        >
          <tspan
            className="bg-white px-1 py-0.5 rounded"
            style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 3 }}
          >
            {label}
          </tspan>
        </motion.text>
      )}
    </svg>
  );
}

/**
 * Helper function to calculate a Bezier curve path between two points
 * @param fromX - Starting X coordinate
 * @param fromY - Starting Y coordinate
 * @param toX - Ending X coordinate
 * @param toY - Ending Y coordinate
 * @returns SVG path string
 */
export function calculateBezierPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): string {
  // Calculate control points for smooth curve
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  // Control points create an S-curve for vertical flow
  const controlPoint1X = fromX;
  const controlPoint1Y = fromY + deltaY * 0.5;
  const controlPoint2X = toX;
  const controlPoint2Y = toY - deltaY * 0.5;

  return `M ${fromX},${fromY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${toX},${toY}`;
}

/**
 * Get the center position of a DOM element
 * @param elementId - The ID of the element
 * @returns Object with x and y coordinates, or null if element not found
 */
export function getElementCenter(elementId: string): { x: number; y: number } | null {
  const element = document.getElementById(elementId);
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    x: rect.left + rect.width / 2 + scrollLeft,
    y: rect.top + rect.height / 2 + scrollTop,
  };
}
