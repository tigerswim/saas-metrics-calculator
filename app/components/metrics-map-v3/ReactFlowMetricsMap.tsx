'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CalculatedMetrics, Inputs } from '../../types';
import { useMetricsGraph } from './useMetricsGraph';
import { useLayout } from './useLayout';
import {
  applyVisibility,
  applyHighlight,
  searchNodes,
  getNodeOpacity,
  getTwoDegreesOfConnections,
  calculatePopoverPosition,
  FocusState,
} from './graphUtils';
import ControlsBar from './ControlsBar';
import StandardNode from './nodes/StandardNode';
import PrimaryNode from './nodes/PrimaryNode';
import RelationshipPanel from '../metrics-map-v2/RelationshipPanel';
import { MetricPopover } from './MetricPopover';

const nodeTypes = {
  standard: StandardNode,
  primary: PrimaryNode,
};

interface ReactFlowMetricsMapProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

function ReactFlowMetricsMapInner({ metrics, inputs }: ReactFlowMetricsMapProps) {
  const reactFlowInstance = useReactFlow();
  const { fitView } = reactFlowInstance;

  // View state
  const [viewMode, setViewMode] = useState<'executive' | 'builder'>('executive');
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(['outcomes', 'revenue'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Focus state for highlighting
  const [focusState, setFocusState] = useState<FocusState>({
    selectedMetricId: null,
    primary: [],
    secondary: [],
  });

  // Panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Popover position state
  const [popoverPosition, setPopoverPosition] = useState<{
    x: number;
    y: number;
    placement: 'right' | 'left' | 'top' | 'bottom';
  } | null>(null);

  // Generate base nodes and edges from metrics data
  const { nodes: baseNodes, edges: baseEdges } = useMetricsGraph(metrics, inputs);

  // Apply visibility filtering
  const visibleNodes = useMemo(() => {
    let filtered = applyVisibility(baseNodes, viewMode, visibleLayers);

    // Apply search filter
    if (searchQuery) {
      const matchingNodes = searchNodes(filtered, searchQuery);
      const matchingIds = new Set(matchingNodes.map(n => n.id));
      filtered = filtered.map(node => ({
        ...node,
        hidden: !matchingIds.has(node.id),
      }));
    }

    // Apply opacity based on focus
    return filtered.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: getNodeOpacity(node.id, focusState),
      },
    }));
  }, [baseNodes, viewMode, visibleLayers, searchQuery, focusState]);

  // Compute layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useLayout(visibleNodes, baseEdges);

  // Apply highlighting to edges
  const highlightedEdges = useMemo(() => {
    return applyHighlight(layoutedEdges, focusState);
  }, [layoutedEdges, focusState]);

  // Use React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(highlightedEdges);

  // Update nodes and edges when layout changes
  useEffect(() => {
    setNodes(layoutedNodes);
  }, [layoutedNodes, setNodes]);

  useEffect(() => {
    setEdges(highlightedEdges);
  }, [highlightedEdges, setEdges]);

  // Check mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (focusState.selectedMetricId === node.id) {
      // Deselect
      setFocusState({
        selectedMetricId: null,
        primary: [],
        secondary: [],
      });
      setIsPanelOpen(false);
      setPopoverPosition(null);
    } else {
      // Select and show connections
      const connections = getTwoDegreesOfConnections(node.id);
      setFocusState({
        selectedMetricId: node.id,
        primary: connections.primary,
        secondary: connections.secondary,
      });

      // Calculate popover position for desktop
      const position = calculatePopoverPosition(node.id, nodes, reactFlowInstance);
      setPopoverPosition(position);

      setIsPanelOpen(true);
    }
  }, [focusState.selectedMetricId, nodes, reactFlowInstance]);

  // Handle layer toggle
  const handleLayerToggle = useCallback((layer: string) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layer)) {
        newSet.delete(layer);
      } else {
        newSet.add(layer);
      }
      return newSet;
    });
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    // If searching, auto-jump to first result
    if (query.trim()) {
      const matching = searchNodes(baseNodes, query);
      if (matching.length > 0) {
        // Center on first matching node (will be implemented with fitView)
      }
    }
  }, [baseNodes]);

  // Handle reset
  const handleReset = useCallback(() => {
    setViewMode('executive');
    setVisibleLayers(new Set(['outcomes', 'revenue']));
    setSearchQuery('');
    setFocusState({
      selectedMetricId: null,
      primary: [],
      secondary: [],
    });
    setIsPanelOpen(false);
    setPopoverPosition(null);
    setTimeout(() => fitView({ duration: 300 }), 100);
  }, [fitView]);

  // Handle fit view
  const handleFitView = useCallback(() => {
    fitView({ duration: 300, padding: 0.2 });
  }, [fitView]);

  // Handle canvas pan/zoom - update popover position to follow node
  const onMove = useCallback(() => {
    if (focusState.selectedMetricId && isPanelOpen && !isMobile) {
      requestAnimationFrame(() => {
        const position = calculatePopoverPosition(
          focusState.selectedMetricId!,
          nodes,
          reactFlowInstance
        );

        // Hide popover if node is out of viewport
        if (!position) {
          setIsPanelOpen(false);
          setPopoverPosition(null);
        } else {
          setPopoverPosition(position);
        }
      });
    }
  }, [focusState.selectedMetricId, isPanelOpen, isMobile, nodes, reactFlowInstance]);

  // Handle pane click (click on canvas background) - close popover
  const handlePaneClick = useCallback(() => {
    setFocusState({
      selectedMetricId: null,
      primary: [],
      secondary: [],
    });
    setIsPanelOpen(false);
    setPopoverPosition(null);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFocusState({
          selectedMetricId: null,
          primary: [],
          secondary: [],
        });
        setIsPanelOpen(false);
        setPopoverPosition(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Get selected metric info for panel
  const selectedMetricInfo = useMemo(() => {
    if (!focusState.selectedMetricId) {
      return { label: '', value: '', efficiencyMetric: undefined };
    }

    const node = nodes.find(n => n.id === focusState.selectedMetricId);
    if (node) {
      return {
        label: node.data.label,
        value: node.data.value,
        efficiencyMetric: undefined, // Can be enhanced later
      };
    }

    return { label: focusState.selectedMetricId, value: '-', efficiencyMetric: undefined };
  }, [focusState.selectedMetricId, nodes]);

  return (
    <section className="mb-6 sm:mb-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 mb-1 sm:mb-2">
          Metrics Map (React Flow)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Interactive node graph showing metric relationships and causal flows
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden" style={{ height: 'min(800px, calc(100vh - 280px))' }}>
        {/* Controls Bar */}
        <ControlsBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          visibleLayers={visibleLayers}
          onLayerToggle={handleLayerToggle}
          onSearch={handleSearch}
          onReset={handleReset}
          onFitView={handleFitView}
        />

        {/* React Flow Canvas */}
        <div className="h-[calc(100%-60px)] sm:h-[calc(100%-100px)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={handlePaneClick}
            onMove={onMove}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: false,
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />

            {/* Legend Panel */}
            <Panel position="bottom-right" className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 text-xs">
              <div className="font-semibold text-slate-700 mb-2">Tiers</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-700 to-indigo-500 rounded-sm" />
                  <span>Outcomes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-700 to-emerald-500 rounded-sm" />
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-teal-700 to-cyan-500 rounded-sm" />
                  <span>Acquisition</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-700 to-blue-500 rounded-sm" />
                  <span>Activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-slate-700 to-slate-500 rounded-sm" />
                  <span>Budget</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Conditional panel rendering: Desktop popover / Mobile bottom sheet */}
      {isMobile ? (
        <RelationshipPanel
          isOpen={isPanelOpen}
          metricId={focusState.selectedMetricId}
          metricLabel={selectedMetricInfo.label as string}
          metricValue={selectedMetricInfo.value as string}
          efficiencyMetric={selectedMetricInfo.efficiencyMetric}
          onClose={() => {
            setIsPanelOpen(false);
            setFocusState({
              selectedMetricId: null,
              primary: [],
              secondary: [],
            });
            setPopoverPosition(null);
          }}
          isMobile={isMobile}
        />
      ) : (
        <MetricPopover
          isOpen={isPanelOpen}
          position={popoverPosition}
          metricId={focusState.selectedMetricId}
          metricLabel={selectedMetricInfo.label as string}
          metricValue={selectedMetricInfo.value as string}
          onClose={() => {
            setIsPanelOpen(false);
            setFocusState({
              selectedMetricId: null,
              primary: [],
              secondary: [],
            });
            setPopoverPosition(null);
          }}
        />
      )}
    </section>
  );
}

// Wrap with ReactFlowProvider
export default function ReactFlowMetricsMap(props: ReactFlowMetricsMapProps) {
  return (
    <ReactFlowProvider>
      <ReactFlowMetricsMapInner {...props} />
    </ReactFlowProvider>
  );
}
