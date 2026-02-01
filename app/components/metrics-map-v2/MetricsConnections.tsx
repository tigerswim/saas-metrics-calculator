'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Connection {
  from: string;
  to: string;
  label?: string;
}

interface MetricsConnectionsProps {
  connections: Connection[];
  focusState: {
    selectedMetricId: string | null;
    primary: string[];
    secondary: string[];
  };
}

interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function MetricsConnections({ connections, focusState }: MetricsConnectionsProps) {
  const [cardPositions, setCardPositions] = useState<Map<string, CardPosition>>(new Map());
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  // Calculate card positions
  useEffect(() => {
    const updatePositions = () => {
      const newPositions = new Map<string, CardPosition>();

      // Find the container to get relative positions
      const container = document.querySelector('.metrics-connections-container');
      if (!container) return;

      const containerBounds = container.getBoundingClientRect();
      setContainerRect(containerBounds);

      // Get all metric cards
      connections.forEach(({ from, to }) => {
        [from, to].forEach(id => {
          const element = document.getElementById(id);
          if (element && !newPositions.has(id)) {
            const rect = element.getBoundingClientRect();
            newPositions.set(id, {
              x: rect.left - containerBounds.left + rect.width / 2,
              y: rect.top - containerBounds.top + rect.height / 2,
              width: rect.width,
              height: rect.height,
            });
          }
        });
      });

      setCardPositions(newPositions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    // Update positions after a brief delay to allow layout to settle
    const timer = setTimeout(updatePositions, 100);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
      clearTimeout(timer);
    };
  }, [connections, focusState.selectedMetricId]);

  // Calculate smart Bezier curve path
  const calculatePath = (from: CardPosition, to: CardPosition, fromId: string, toId: string): string => {
    // Determine the best connection points based on relative positions
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    let startX, startY, endX, endY;

    // Special handling for acquisition funnel horizontal flow
    // These connections should exit left of source and enter left of target
    const acquisitionFunnelPairs = [
      ['impressions', 'ctr'],
      ['ctr', 'clicks'],
      ['clicks', 'click-to-lead-rate'],
      ['click-to-lead-rate', 'leads'],
      ['leads', 'lead-to-mql-rate'],
      ['lead-to-mql-rate', 'mqls'],
      ['mqls', 'mql-to-sql-rate'],
      ['mql-to-sql-rate', 'sqls'],
      ['sqls', 'sql-to-opp-rate'],
      ['sql-to-opp-rate', 'opportunities'],
      ['opportunities', 'win-rate'],
      ['win-rate', 'deals-won'],
    ];

    const isAcquisitionFlow = acquisitionFunnelPairs.some(
      ([f, t]) => f === fromId && t === toId
    );

    if (isAcquisitionFlow) {
      // Exit from left side of source, enter left side of target
      startX = from.x - from.width / 2;
      startY = from.y;
      endX = to.x - to.width / 2;
      endY = to.y;

      // Create a wide loop that goes far to the left before turning
      const horizontalOffset = 80; // Loop far to the left
      const cp1X = startX - horizontalOffset;
      const cp1Y = startY + (deltaY * 0.2); // Start the vertical movement
      const cp2X = endX - horizontalOffset;
      const cp2Y = endY - (deltaY * 0.2); // Complete the approach

      return `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
    }

    // Special handling for Business Outcomes horizontal flow (KPI % → P&L → Efficiency)
    // These connections should exit right and enter left for horizontal progression
    const businessOutcomesPairs = [
      // KPI % → P&L
      ['gross-margin', 'gross-profit'],
      ['ebitda-margin', 'ebitda'],
      // P&L → Efficiency
      ['gross-profit', 'ltv'],
      ['total-opex', 'cac-blended'],
      ['ebitda', 'burn-multiple'],
      // Within Efficiency column (vertical)
      ['ltv', 'ltv-cac-ratio'],
      ['cac-blended', 'ltv-cac-ratio'],
      ['ltv', 'cac-payback-period'],
      ['cac-blended', 'cac-payback-period'],
    ];

    const isBusinessOutcomesFlow = businessOutcomesPairs.some(
      ([f, t]) => f === fromId && t === toId
    );

    if (isBusinessOutcomesFlow) {
      // Exit from right side of source, enter left side of target
      startX = from.x + from.width / 2;
      startY = from.y;
      endX = to.x - to.width / 2;
      endY = to.y;

      // Simple smooth curve for horizontal progression
      const controlPointOffset = Math.abs(deltaX) * 0.4;
      const cp1X = startX + controlPointOffset;
      const cp1Y = startY + (deltaY * 0.3);
      const cp2X = endX - controlPointOffset;
      const cp2Y = endY - (deltaY * 0.3);

      return `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
    }

    // Default behavior for other connections
    // If target is mostly to the right, connect horizontally
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        // Target is to the right
        startX = from.x + from.width / 2;
        startY = from.y;
        endX = to.x - to.width / 2;
        endY = to.y;
      } else {
        // Target is to the left
        startX = from.x - from.width / 2;
        startY = from.y;
        endX = to.x + to.width / 2;
        endY = to.y;
      }

      // Horizontal curve
      const controlPointOffset = Math.abs(deltaX) * 0.4;
      const cp1X = startX + (deltaX > 0 ? controlPointOffset : -controlPointOffset);
      const cp1Y = startY;
      const cp2X = endX - (deltaX > 0 ? controlPointOffset : -controlPointOffset);
      const cp2Y = endY;

      return `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
    } else {
      // Target is mostly above or below - connect vertically
      if (deltaY > 0) {
        // Target is below
        startX = from.x;
        startY = from.y + from.height / 2;
        endX = to.x;
        endY = to.y - to.height / 2;
      } else {
        // Target is above
        startX = from.x;
        startY = from.y - from.height / 2;
        endX = to.x;
        endY = to.y + to.height / 2;
      }

      // Vertical curve
      const controlPointOffset = Math.abs(deltaY) * 0.4;
      const cp1X = startX;
      const cp1Y = startY + (deltaY > 0 ? controlPointOffset : -controlPointOffset);
      const cp2X = endX;
      const cp2Y = endY - (deltaY > 0 ? controlPointOffset : -controlPointOffset);

      return `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
    }
  };

  // Determine if a connection should be visible and its opacity
  const getConnectionOpacity = (from: string, to: string): number => {
    if (!focusState.selectedMetricId) {
      return 0; // Hidden in default state - only show on focus
    }

    const selected = focusState.selectedMetricId;
    const involvesSelected = from === selected || to === selected;

    // Only show direct connections to/from selected metric
    if (involvesSelected) return 0.9;
    return 0;
  };

  // Get stroke width based on connection importance
  const getStrokeWidth = (from: string, to: string): number => {
    return 3; // Consistent thickness for all visible connections
  };

  // Get connection color based on direction
  const getConnectionColor = (from: string, to: string): string => {
    const selected = focusState.selectedMetricId;

    // Orange for incoming (inputs to selected)
    if (to === selected) return '#f97316'; // orange-500

    // Blue for outgoing (selected to outputs)
    if (from === selected) return '#3b82f6'; // blue-500

    return '#94a3b8'; // slate-400 fallback
  };

  // Check if connection should be animated
  const shouldAnimate = (from: string, to: string): boolean => {
    if (!focusState.selectedMetricId) return false;

    const selected = focusState.selectedMetricId;
    const isPrimary = focusState.primary.includes(from) || focusState.primary.includes(to);
    const involvesSelected = from === selected || to === selected;

    return involvesSelected || isPrimary;
  };

  if (!containerRect) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      <defs>
        {/* Arrow markers - smaller size */}
        <marker
          id="arrowhead-orange"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,4 L5,2 z" fill="#f97316" />
        </marker>
        <marker
          id="arrowhead-blue"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,4 L5,2 z" fill="#3b82f6" />
        </marker>
      </defs>

      {connections.map(({ from, to, label }, index) => {
        const fromPos = cardPositions.get(from);
        const toPos = cardPositions.get(to);

        if (!fromPos || !toPos) return null;

        const opacity = getConnectionOpacity(from, to);
        const strokeWidth = getStrokeWidth(from, to);
        const animated = shouldAnimate(from, to);
        const path = calculatePath(fromPos, toPos, from, to);
        const color = getConnectionColor(from, to);

        // Determine arrow marker based on color
        const markerEnd = color === '#f97316' ? 'url(#arrowhead-orange)' : 'url(#arrowhead-blue)';

        return (
          <g key={`${from}-${to}-${index}`}>
            <motion.path
              d={path}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={markerEnd}
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              transition={{ duration: 0.3 }}
              style={{
                strokeDasharray: animated ? '5 5' : undefined,
                animation: animated ? 'flowDash 1.5s linear infinite' : undefined,
              }}
            />

            {/* Connection label */}
            {label && opacity > 0 && (
              <g>
                {/* White background for label */}
                <motion.rect
                  x={(fromPos.x + toPos.x) / 2 - 20}
                  y={(fromPos.y + toPos.y) / 2 - 10}
                  width="40"
                  height="20"
                  rx="4"
                  fill="white"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: opacity }}
                  transition={{ duration: 0.3 }}
                />
                {/* Label text */}
                <motion.text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 + 4}
                  className="text-xs font-semibold"
                  textAnchor="middle"
                  fill={color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: opacity }}
                  transition={{ duration: 0.3 }}
                >
                  {label}
                </motion.text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
