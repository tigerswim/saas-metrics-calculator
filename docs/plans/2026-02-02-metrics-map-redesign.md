# Metrics Map V3 Redesign - React Flow Node-Link Diagram

## Overview

Redesign the existing vertical layered Metrics Map (v2) into an interactive node-link diagram using React Flow, optimized for executive scannability and progressive disclosure. This will replace the current linear layout with a dynamic graph visualization.

## Current Implementation Context

### Existing Architecture
- **Framework**: Next.js 14 with App Router, React 18, TypeScript
- **Current Metrics Map**: `app/components/metrics-map-v2/VerticalMetricsMap.tsx`
  - Vertical layered design with collapsible sections
  - 5 layers: Budget, Activities, Acquisition, Revenue, Outcomes
  - Interactive focus mode showing 1st/2nd degree relationships
  - RelationshipPanel slideout for metric details
- **Data Flow**:
  - Inputs (40+ fields) → `calculateMetrics()` → CalculatedMetrics (50+ metrics)
  - Relationships defined in `app/utils/metricsGraph.ts`
  - Status evaluation in `app/utils/metricTargets.ts`
  - Formulas documented in `app/utils/metricFormulas.ts`
- **State Management**: React hooks (useState, useMemo) in Calculator.tsx
- **Styling**: Tailwind CSS with status-based color coding

### Metrics Organization
Current layers match the existing implementation:
1. **Budget** (Operating Budget) - slate gradient
2. **Activities** (Marketing Channels) - blue gradient
3. **Acquisition** (Funnel Flow) - teal/cyan gradient
4. **Revenue** (ARR & Retention) - green/emerald gradient
5. **Outcomes** (Unit Economics & Financial) - purple/indigo gradient

## Technical Implementation

### Tech Stack
- **Graph Library**: React Flow (@xyflow/react) - NEW dependency to add
- **State Management**: Existing React hooks (no Zustand needed)
- **Layout Engine**: React Flow's built-in layouting or @dagrejs/dagre
- **Styling**: Tailwind CSS (existing)
- **Export**: html-to-image (optional enhancement)
- **TypeScript**: Strict mode (existing)

### Integration Points
- Replace VerticalMetricsMap component with new ReactFlowMetricsMap
- Reuse existing utilities:
  - `metricsGraph.ts` for node relationships
  - `metricTargets.ts` for status evaluation
  - `metricFormulas.ts` for formula display
  - `metricsMapUtils.ts` for formatting
- Maintain compatibility with Calculator component state
- Preserve RelationshipPanel for metric details

## UX Goals

1. **Executive Scannability**: Outcomes → Drivers → Efficiency shown by default
2. **Progressive Disclosure**: Toggle deeper layers (Acquisition, Activities, Budget)
3. **Fast Navigation**: Search/jump to metrics, highlight causal paths
4. **Accessibility**: Keyboard navigation, focus states, reduced-motion support

## Layout Design

### View Modes
- **Executive Mode** (default):
  - Show: Outcomes, Efficiency, key Drivers
  - Hide: Budget, Activities, detailed Acquisition funnel
  - Primary edges only
- **Builder Mode**:
  - Show all 5 layers
  - Primary + secondary edges
  - Full relationship visibility

### Node Design
Reuse existing tier color scheme:
- **Budget**: slate-700 to slate-500 gradient
- **Activities**: blue-700 to blue-500 gradient
- **Acquisition**: teal-700 to cyan-500 gradient
- **Revenue**: green-700 to emerald-500 gradient
- **Outcomes**: purple-700 to indigo-500 gradient

## Data Model

### Node Structure
Each metric node extends existing metric data:
```typescript
interface MetricNode {
  id: string;               // Matches metricsGraph keys
  label: string;            // Display name
  value: string;            // Formatted value from metrics
  tier: 'budget' | 'activities' | 'acquisition' | 'revenue' | 'outcomes';
  group?: string;           // Optional grouping within tier
  status: 'good' | 'warning' | 'bad' | 'neutral';
  isPrimary?: boolean;      // For Executive mode visibility
  sparklineData?: number[]; // For trend visualization
  changePercent?: number;   // Week-over-week change
}
```

### Layer Content (Existing Metrics)

**Tier: Budget** (Operating Budget)
- Sales & Marketing Spend
- Marketing Spend
- Sales Spend
- R&D Spend
- G&A Spend

**Tier: Activities** (Marketing Channels)
- Paid Search
- Paid Social
- Events
- Content Marketing
- Partnerships
- ABM

**Tier: Acquisition** (Funnel Flow)
- Volume Metrics: Impressions, Clicks, Leads, MQLs, SQLs, Opportunities, Deals Won
- Conversion Rates: CTR, Click→Lead, Lead→MQL, MQL→SQL, SQL→Opp, Win Rate
- Efficiency: CPM, CPC, Cost/Lead, Cost/MQL, Cost/SQL
- Pipeline: Pipeline Value, Pipeline Velocity, Pipeline Conversion

**Tier: Revenue** (ARR & Retention)
- ARR Waterfall: Beginning ARR, Net New ARR, Ending ARR, MRR, ARR Growth
- New: New Customers, New Bookings
- Existing: Expansion ARR, Churned ARR, GRR, NRR, Logo Churn, Total Customers, ARPA

**Tier: Outcomes** (Business Performance)
- KPI %: Gross Margin, EBITDA Margin, Rule of 40
- P&L: Gross Profit, Total OpEx, EBITDA
- Efficiency: CAC (Blended/Paid), LTV, LTV:CAC, Magic Number, Quick Ratio, Burn Multiple, CAC Payback, S&M Payback

## Grouping & Clustering

Use React Flow group nodes for visual organization:
- **Activities Groups**: Paid (Search/Social), Field (Events), ABM, Partnerships
- **Acquisition Groups**: Volume Funnel, Conversion Rates, Efficiency Metrics, Pipeline
- **Revenue Groups**: New Revenue, ARR Waterfall, Retention
- **Outcomes Groups**: KPI %, P&L, Efficiency

Implementation:
- Group nodes with `type: 'group'`
- Child nodes reference group via `parentId`
- Constrain movement with `extent: 'parent'`
- Collapsible groups (hide children, show summary node)

## Edge Relationships

Edges are sourced from `metricsGraph.ts` existing relationships. Key flows:

### Budget → Activities
- Marketing Spend → [Paid Search, Paid Social, Events, Content, Partnerships, ABM]
- S&M Spend → CAC Blended, Magic Number

### Activities → Acquisition
- Paid channels → Impressions
- All channels → Leads (direct/indirect)

### Acquisition Flow (Primary Path)
- Impressions → CTR → Clicks → CPC
- Clicks → Click→Lead → Leads → Cost/Lead
- Leads → Lead→MQL → MQLs → Cost/MQL
- MQLs → MQL→SQL → SQLs → Cost/SQL
- SQLs → SQL→Opp → Opportunities
- Opportunities → Win Rate → Deals Won
- Pipeline metrics derive from Opportunities and Deals Won

### Acquisition → Revenue
- Deals Won → New Customers → New Bookings
- New Bookings + Expansion - Churn → Net New ARR
- Net New ARR + Beginning ARR → Ending ARR → MRR
- Retention metrics (GRR, NRR) from Expansion/Churn

### Revenue → Outcomes
- ARR Growth + EBITDA Margin → Rule of 40
- MRR + Gross Margin → Gross Profit → EBITDA
- Budget (S&M, R&D, G&A) → Total OpEx → EBITDA
- ARPA + Customer Lifetime → LTV
- S&M Spend / New Customers → CAC
- LTV / CAC → LTV:CAC Ratio
- Net New ARR / S&M Spend → Magic Number
- (New Bookings + Expansion) / Churn → Quick Ratio

## Visual Design

### Edge Rendering
- **Default**: opacity 0.3, stroke-width 1px, gray-400
- **Primary edges**: opacity 0.5, stroke-width 2px (in Executive mode)
- **Secondary edges**: opacity 0.25, stroke-width 1px (Builder mode only)
- **Hover**: Highlight connected edges (opacity 1.0, matching tier color)
- **Focus mode**: Full upstream/downstream path highlighted, others dimmed (opacity 0.15)
- **Animated edges**: Reuse React Flow's built-in animations (respect prefers-reduced-motion)

### Layout Engine
- **Strategy**: Dagre hierarchical layout (left-to-right, tier-based columns)
- **Deterministic**: Fixed seed for consistent positioning
- **Spacing**:
  - Column gap (tier separation): 200px
  - Row gap (node separation): 20px
  - Group padding: 16px
  - Node size: ~160px width × ~80px height (adapt to content)
- **Re-layout button**: Recompute after layer toggles or group collapse

### Node Components
Custom node types matching existing MetricCardV2 design:
- **StandardNode**: Basic metric with value, status indicator
- **PrimaryNode**: Larger, with sparkline and change % badge
- **GroupNode**: Collapsible container with header and child count
- Status colors match existing system (emerald/amber/rose/slate borders)

## Interaction Model

### Control Bar (Top)
- **Search**: Typeahead filter, jumps to node, highlights path
- **View Mode**: Executive / Builder toggle
- **Layer Toggles**: Show/hide Budget, Activities, Acquisition, Revenue, Outcomes
- **Edge Filter**: Primary only (default) / All edges
- **Actions**: Reset View, Fit to View, Export PNG (optional)

### Canvas Interactions
- **Pan/Zoom**: React Flow built-in controls enabled
- **Node Click**: Enter focus mode, open RelationshipPanel
- **Node Hover**: Highlight 1st-degree connections
- **ESC Key**: Exit focus mode, close panel
- **Controls**: Zoom in/out, fit view (React Flow Controls component)
- **MiniMap**: Optional, ON in Builder mode, OFF in Executive

### Details Panel (Right, Slideout)
Reuse existing RelationshipPanel component with additions:
- **No Selection**: Show legend (tier colors), usage hints
- **Node Selected**:
  - Metric label, value, status
  - "Driven By" (upstream nodes with connections)
  - "Influences" (downstream nodes with connections)
  - Formula (expandable)
  - Target thresholds
  - "Why This Matters" description
- **Actions**:
  - Trace to Outcomes (highlight path)
  - Trace to Sources (highlight path)
  - Copy link (#metric=id URL hash)

### Accessibility
- **Keyboard Navigation**:
  - `/` focuses search input
  - `ESC` clears selection
  - `Tab` cycles controls
  - `Enter`/`Space` selects focused node (when possible)
- **Focus States**: Visible focus rings on all interactive elements
- **Reduced Motion**: Disable edge animations, reduce zoom transitions
- **Color Contrast**: WCAG AA compliant (status indicators + text)

### Responsive Behavior
- **Desktop-first**: Optimized for 1440x900+
- **Tablet (<1024px)**: Simplified tier-based navigation
  - Tier selector/tabs instead of full graph
  - List view of metrics with expand for relationships
  - Tap metric → show connections as list
- **Mobile (<768px)**: Maintain existing VerticalMetricsMap fallback (optional)

## Implementation Details

### Dependencies to Add
```bash
npm install @xyflow/react
npm install dagre @types/dagre  # For hierarchical layout
npm install html-to-image       # Optional, for PNG export
```

### File Structure
```
app/components/metrics-map-v3/
├── ReactFlowMetricsMap.tsx      # Main component (replaces VerticalMetricsMap)
├── nodes/
│   ├── StandardNode.tsx         # Basic metric node
│   ├── PrimaryNode.tsx          # Enhanced node with sparkline
│   └── GroupNode.tsx            # Collapsible group container
├── ControlsBar.tsx              # Top control bar with search/toggles
├── MetricsMapCanvas.tsx         # React Flow wrapper with layout
├── useMetricsGraph.ts           # Hook for node/edge generation
├── useLayout.ts                 # Dagre layout computation
└── graphUtils.ts                # Visibility, highlighting, path tracing
```

### Reused Utilities (Existing)
- `app/utils/metricsGraph.ts` - Edge relationships (`metricsRelationships`)
- `app/utils/metricTargets.ts` - Status evaluation (`getCalculatedMetricStatus`)
- `app/utils/metricFormulas.ts` - Formula descriptions
- `app/utils/metricsMapUtils.ts` - Value formatting (`formatMetricValue`)
- `app/components/metrics-map-v2/RelationshipPanel.tsx` - Metric details panel

### State Management
```typescript
// In ReactFlowMetricsMap.tsx
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
const [viewMode, setViewMode] = useState<'executive' | 'builder'>('executive');
const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set(['outcomes', 'revenue']));
const [focusState, setFocusState] = useState<FocusState>({ selected: null, highlighted: [] });
const [searchQuery, setSearchQuery] = useState('');
```

### Core Functions
```typescript
// graphUtils.ts
export function getUpstreamPath(nodeId: string, depth?: number): string[];
export function getDownstreamPath(nodeId: string, depth?: number): string[];
export function applyVisibility(
  nodes: Node[],
  mode: 'executive' | 'builder',
  visibleLayers: Set<string>
): Node[];
export function applyHighlight(
  edges: Edge[],
  focusedNodeId: string | null,
  highlightedNodes: string[]
): Edge[];
export function searchNodes(nodes: Node[], query: string): Node[];
```

### Layout Strategy
```typescript
// useLayout.ts
import dagre from 'dagre';

export function computeDagreLayout(
  nodes: Node[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: Node[]; edges: Edge[] } {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: direction,
    nodesep: 20,
    ranksep: 200,
    marginx: 50,
    marginy: 50
  });

  // Add nodes and edges to dagre graph
  // Compute layout
  // Return positioned nodes
}
```

### Performance Optimizations
- Memoize node components with `React.memo`
- Use `useMemo` for expensive graph computations
- Debounce search input (300ms)
- Virtualize off-screen nodes (React Flow handles this)
- Lazy-load RelationshipPanel content

### Integration with Calculator
```typescript
// app/components/Calculator.tsx
import ReactFlowMetricsMap from './metrics-map-v3/ReactFlowMetricsMap';

// In render, replace VerticalMetricsMap with:
{showMetricsMap && viewMode === 'flow' && (
  <ReactFlowMetricsMap metrics={metrics} inputs={inputs} />
)}
```

## Deliverables

### Phase 1: Core Graph
- [ ] Install dependencies (@xyflow/react, dagre)
- [ ] Create ReactFlowMetricsMap component scaffold
- [ ] Implement node/edge generation from metricsGraph
- [ ] Apply Dagre layout algorithm
- [ ] Render basic nodes with tier colors
- [ ] Enable pan/zoom controls

### Phase 2: Interactions
- [ ] Implement Executive/Builder view modes
- [ ] Add layer visibility toggles
- [ ] Node click → focus mode + highlight paths
- [ ] Node hover → highlight 1st-degree connections
- [ ] Search functionality with jump-to-node
- [ ] ESC key to clear selection

### Phase 3: Details & Polish
- [ ] Integrate RelationshipPanel (reuse existing)
- [ ] Custom node components (Standard, Primary, Group)
- [ ] Group collapse/expand functionality
- [ ] Edge styling (primary/secondary)
- [ ] Status color indicators
- [ ] Sparklines in primary nodes

### Phase 4: Enhancements
- [ ] MiniMap component
- [ ] Export to PNG functionality
- [ ] URL hash navigation (#metric=id)
- [ ] Trace to Outcomes/Sources buttons
- [ ] Responsive fallback (<1024px)
- [ ] Accessibility improvements

## Migration Strategy

1. **Create new component** alongside existing VerticalMetricsMap
2. **Add view toggle** in Calculator to switch between v2 (vertical) and v3 (flow)
3. **Test thoroughly** with real data
4. **Gather user feedback** on usability
5. **Make v3 default** after validation
6. **Deprecate v2** after stabilization period

## Success Criteria

- [ ] Renders all 50+ metrics in hierarchical layout
- [ ] Executive mode shows <20 nodes by default (Outcomes + key drivers)
- [ ] Search finds and highlights metrics in <500ms
- [ ] Focus mode correctly traces upstream/downstream paths
- [ ] Layer toggles work smoothly without layout glitches
- [ ] RelationshipPanel displays accurate formulas and connections
- [ ] Passes WCAG AA color contrast requirements
- [ ] Works on desktop browsers (Chrome, Safari, Firefox, Edge)
- [ ] No console errors or React warnings
- [ ] Performance: <100ms to render, <16ms frame time on interactions

## Notes

- Preserve existing v2 implementation as fallback
- Reuse as much existing code as possible (RelationshipPanel, utilities)
- Follow existing Tailwind styling conventions
- Match existing status color scheme (emerald/amber/rose)
- Maintain type safety (strict TypeScript)
- Document component props and usage
- Add inline comments for complex graph logic
