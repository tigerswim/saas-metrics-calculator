// Dagre layout hook for hierarchical graph positioning

import { useMemo } from 'react';
import { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';

export interface LayoutOptions {
  direction?: 'LR' | 'TB';
  nodeWidth?: number;
  nodeHeight?: number;
  rankSep?: number;
  nodeSep?: number;
}

const defaultOptions: Required<LayoutOptions> = {
  direction: 'LR', // Left to right (matches tier flow)
  nodeWidth: 180,
  nodeHeight: 100,
  rankSep: 150, // Space between tiers/columns
  nodeSep: 20, // Space between nodes in same tier
};

/**
 * Compute Dagre hierarchical layout for nodes and edges
 */
export function computeDagreLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  const opts = { ...defaultOptions, ...options };

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: opts.direction,
    ranksep: opts.rankSep,
    nodesep: opts.nodeSep,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to dagre graph
  nodes.forEach(node => {
    // Use actual node dimensions if available, otherwise use defaults
    const width = node.width || opts.nodeWidth;
    const height = node.height || opts.nodeHeight;

    graph.setNode(node.id, {
      width,
      height,
    });
  });

  // Add edges to dagre graph
  edges.forEach(edge => {
    graph.setEdge(edge.source, edge.target);
  });

  // Compute layout
  dagre.layout(graph);

  // Apply computed positions to nodes
  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = graph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (node.width || opts.nodeWidth) / 2,
        y: nodeWithPosition.y - (node.height || opts.nodeHeight) / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}

/**
 * Hook to compute layout with memoization
 */
export function useLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  return useMemo(() => {
    // Only compute layout for visible nodes
    const visibleNodes = nodes.filter(n => !n.hidden);
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

    // Filter edges to only those connecting visible nodes
    const visibleEdges = edges.filter(
      e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );

    const { nodes: layoutedNodes, edges: layoutedEdges } = computeDagreLayout(
      visibleNodes,
      visibleEdges,
      options
    );

    // Merge back with hidden nodes (keep their original positions)
    const hiddenNodes = nodes.filter(n => n.hidden);

    return {
      nodes: [...layoutedNodes, ...hiddenNodes],
      edges: layoutedEdges,
    };
  }, [nodes, edges, options.direction, options.nodeWidth, options.nodeHeight]);
}

/**
 * Compute tier-based rank assignment for custom tier ordering
 */
export function getTierRank(tier: string): number {
  const tierOrder: Record<string, number> = {
    budget: 0,
    activities: 1,
    acquisition: 2,
    revenue: 3,
    outcomes: 4,
  };

  return tierOrder[tier] ?? 999;
}

/**
 * Assign manual positions based on tier (alternative to Dagre)
 */
export function computeTierLayout(
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } {
  const tierSpacing = 280;
  const nodeSpacing = 120;

  // Group nodes by tier
  const nodesByTier = nodes.reduce((acc, node) => {
    const tier = (node.data as any)?.tier || 'outcomes';
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(node);
    return acc;
  }, {} as Record<string, Node[]>);

  // Position nodes tier by tier
  const layoutedNodes = nodes.map(node => {
    const tier = (node.data as any)?.tier || 'outcomes';
    const tierNodes = nodesByTier[tier];
    const tierIndex = getTierRank(tier as string);
    const nodeIndex = tierNodes.indexOf(node);

    return {
      ...node,
      position: {
        x: tierIndex * tierSpacing,
        y: nodeIndex * nodeSpacing,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}
