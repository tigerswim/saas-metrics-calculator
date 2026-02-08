// Graph utility functions for visibility, highlighting, and path tracing

import { Node, Edge } from '@xyflow/react';
import { metricsRelationships } from '../../utils/metricsGraph';

export interface FocusState {
  selectedMetricId: string | null;
  primary: string[];
  secondary: string[];
}

/**
 * Get both direct (1st degree) and secondary (2nd degree) connections
 */
export function getTwoDegreesOfConnections(metricId: string): {
  primary: string[];
  secondary: string[];
} {
  const direct = getDirectConnections(metricId);
  const secondary = new Set<string>();

  // Get 2nd degree inputs (what feeds the inputs)
  direct.inputs.forEach(inputId => {
    const inputRelationship = metricsRelationships[inputId];
    if (inputRelationship) {
      inputRelationship.inputs.forEach(id => secondary.add(id));
    }
  });

  // Get 2nd degree outputs (what the outputs affect)
  direct.outputs.forEach(outputId => {
    const outputRelationship = metricsRelationships[outputId];
    if (outputRelationship) {
      outputRelationship.outputs.forEach(id => secondary.add(id));
    }
  });

  // Remove any metrics that are already in primary connections
  const primarySet = new Set([...direct.inputs, ...direct.outputs]);
  const secondaryFiltered = Array.from(secondary).filter(id => !primarySet.has(id));

  return {
    primary: [...direct.inputs, ...direct.outputs],
    secondary: secondaryFiltered,
  };
}

/**
 * Get the direct (1st degree) connections for a metric
 */
function getDirectConnections(metricId: string): {
  inputs: string[];
  outputs: string[];
} {
  const relationship = metricsRelationships[metricId];

  if (!relationship) {
    console.warn(`No relationship found for metric: ${metricId}`);
    return { inputs: [], outputs: [] };
  }

  return {
    inputs: relationship.inputs,
    outputs: relationship.outputs,
  };
}

/**
 * Get all upstream nodes (metrics that feed into this metric)
 */
export function getUpstreamPath(nodeId: string, maxDepth: number = 3): string[] {
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: nodeId, depth: 0 }];
  const upstream: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current.id) || current.depth > maxDepth) {
      continue;
    }

    visited.add(current.id);

    if (current.id !== nodeId) {
      upstream.push(current.id);
    }

    const relationship = metricsRelationships[current.id];
    if (relationship && relationship.inputs) {
      relationship.inputs.forEach(inputId => {
        if (!visited.has(inputId)) {
          queue.push({ id: inputId, depth: current.depth + 1 });
        }
      });
    }
  }

  return upstream;
}

/**
 * Get all downstream nodes (metrics influenced by this metric)
 */
export function getDownstreamPath(nodeId: string, maxDepth: number = 3): string[] {
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: nodeId, depth: 0 }];
  const downstream: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current.id) || current.depth > maxDepth) {
      continue;
    }

    visited.add(current.id);

    if (current.id !== nodeId) {
      downstream.push(current.id);
    }

    const relationship = metricsRelationships[current.id];
    if (relationship && relationship.outputs) {
      relationship.outputs.forEach(outputId => {
        if (!visited.has(outputId)) {
          queue.push({ id: outputId, depth: current.depth + 1 });
        }
      });
    }
  }

  return downstream;
}

/**
 * Apply visibility filtering based on view mode and layer toggles
 */
export function applyVisibility(
  nodes: Node[],
  mode: 'executive' | 'builder',
  visibleLayers: Set<string>
): Node[] {
  if (mode === 'builder') {
    // Builder mode: show layers based on toggles
    return nodes.map(node => ({
      ...node,
      hidden: !visibleLayers.has(node.data?.tier as string || 'outcomes'),
    }));
  }

  // Executive mode: show only Outcomes and key Efficiency metrics by default
  const executiveMetrics = new Set([
    // Outcomes - always visible
    'rule-of-40',
    'ending-arr',
    'arr-growth-rate',
    'ebitda-margin',
    'gross-margin',

    // Key efficiency metrics
    'ltv-cac-ratio',
    'magic-number',
    'cac-blended',
    'ltv',
    'annualized-nrr',
    'annualized-grr',

    // Key drivers
    'net-new-arr',
    'new-bookings',
    'deals-won',
  ]);

  return nodes.map(node => ({
    ...node,
    hidden: mode === 'executive' && !executiveMetrics.has(node.id) && !visibleLayers.has(node.data?.tier as string || 'outcomes'),
  }));
}

/**
 * Apply highlighting to edges based on focus state
 */
export function applyHighlight(
  edges: Edge[],
  focusState: FocusState
): Edge[] {
  if (!focusState.selectedMetricId) {
    // No focus - show all edges with default styling
    return edges.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        opacity: 0.3,
        stroke: '#94a3b8', // slate-400
        strokeWidth: 1,
      },
      animated: false,
    }));
  }

  const allFocused = new Set([
    focusState.selectedMetricId,
    ...focusState.primary,
    ...focusState.secondary,
  ]);

  return edges.map(edge => {
    const isConnected =
      (edge.source === focusState.selectedMetricId || edge.target === focusState.selectedMetricId) ||
      (allFocused.has(edge.source) && allFocused.has(edge.target));

    if (isConnected) {
      // Highlight connected edges
      return {
        ...edge,
        style: {
          ...edge.style,
          opacity: 0.8,
          stroke: '#3b82f6', // blue-500
          strokeWidth: 2,
        },
        animated: true,
      };
    }

    // Dim unconnected edges
    return {
      ...edge,
      style: {
        ...edge.style,
        opacity: 0.1,
        stroke: '#94a3b8',
        strokeWidth: 1,
      },
      animated: false,
    };
  });
}

/**
 * Search nodes by label or id
 */
export function searchNodes(nodes: Node[], query: string): Node[] {
  if (!query.trim()) {
    return nodes;
  }

  const lowerQuery = query.toLowerCase();
  return nodes.filter(node => {
    const label = (node.data as any)?.label?.toLowerCase() || '';
    const id = node.id.toLowerCase();
    return label.includes(lowerQuery) || id.includes(lowerQuery);
  });
}

/**
 * Get node opacity based on focus state
 */
export function getNodeOpacity(nodeId: string, focusState: FocusState): number {
  if (!focusState.selectedMetricId) {
    return 1.0;
  }

  if (nodeId === focusState.selectedMetricId) {
    return 1.0;
  }

  if (focusState.primary.includes(nodeId)) {
    return 0.8;
  }

  if (focusState.secondary.includes(nodeId)) {
    return 0.6;
  }

  return 0.25;
}

/**
 * Check if an edge should be visible based on node visibility
 */
export function shouldShowEdge(edge: Edge, visibleNodes: Set<string>): boolean {
  return visibleNodes.has(edge.source) && visibleNodes.has(edge.target);
}

/**
 * Calculate optimal position for popover anchored to a node
 * Returns null if node is out of viewport bounds
 */
export function calculatePopoverPosition(
  nodeId: string,
  nodes: Node[],
  reactFlowInstance: any // ReactFlowInstance type
): { x: number; y: number; placement: 'right' | 'left' | 'top' | 'bottom' } | null {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;

  // Convert node position to screen coordinates
  const nodeWidth = node.width || 180;
  const nodeHeight = node.height || 100;

  const nodeCenter = {
    x: node.position.x + nodeWidth / 2,
    y: node.position.y + nodeHeight / 2,
  };

  // Use React Flow's flowToScreenPosition function to convert canvas coords to screen coords
  const screenPos = reactFlowInstance.flowToScreenPosition(nodeCenter);

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Popover dimensions
  const popoverWidth = 320;
  const popoverHeight = 400; // estimated max height
  const offset = 20; // gap between node and popover

  // Check if node is in viewport
  if (screenPos.x < 0 || screenPos.x > viewportWidth ||
      screenPos.y < 0 || screenPos.y > viewportHeight) {
    return null; // Node out of bounds, hide popover
  }

  // Determine placement based on available space
  let placement: 'right' | 'left' | 'top' | 'bottom' = 'right';
  let x = screenPos.x + (nodeWidth / 2) + offset;
  let y = screenPos.y - 40; // Align with top of node

  // Check right side space
  if (x + popoverWidth > viewportWidth - 10) {
    // Try left
    placement = 'left';
    x = screenPos.x - (nodeWidth / 2) - popoverWidth - offset;
  }

  // If left doesn't work either, try vertical placement
  if (x < 10) {
    if (screenPos.y + (nodeHeight / 2) + popoverHeight + offset < viewportHeight) {
      // Try bottom
      placement = 'bottom';
      x = screenPos.x - popoverWidth / 2;
      y = screenPos.y + (nodeHeight / 2) + offset;
    } else {
      // Try top
      placement = 'top';
      x = screenPos.x - popoverWidth / 2;
      y = screenPos.y - (nodeHeight / 2) - popoverHeight - offset;
    }
  }

  // Clamp to viewport bounds with padding
  x = Math.max(10, Math.min(x, viewportWidth - popoverWidth - 10));
  y = Math.max(10, Math.min(y, viewportHeight - popoverHeight - 10));

  return { x, y, placement };
}
