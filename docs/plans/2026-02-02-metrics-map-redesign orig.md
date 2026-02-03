You are Claude Code. Build a production-ready React + TypeScript dashboard webpage that renders an interactive SaaS KPI “metrics map” as a node-link diagram optimized for desktop executives.

TECH STACK
- React 18 + TypeScript.
- Use React Flow (@xyflow/react) for the graph.
- Styling: Tailwind CSS (preferred) or CSS modules.
- Optional libs: zustand for UI state, @dagrejs/dagre OR a small custom layout function (no heavy dependencies unless needed), html-to-image for export.

PRIMARY UX GOALS
1) Executive scannability: show “Outcomes + Drivers” first, minimize edge clutter, make the primary story obvious.
2) Progressive disclosure: reveal deeper layers (Efficiency, Effectiveness, Foundation, Marketing Activities) via toggles and drill-down, not all at once.
3) Fast navigation: search a KPI, jump to it, highlight its upstream/downstream path.
4) Accessibility: keyboard navigation for interactive elements, visible focus states, respect prefers-reduced-motion.

PAGE LAYOUT (DESKTOP-FIRST)
- Full page layout with a top control bar and a main content area.
- Main area is a two-panel layout:
  - Left: React Flow canvas (graph) taking ~70% width.
  - Right: “Details Panel” taking ~30% width, collapsible.
- Target: fits without scrolling at 1440x900; max canvas container width 1600px centered; canvas height 85–90vh.

VIEW MODES (Progressive Disclosure)
- Provide a toggle with two modes:
  A) Executive (default):
     - Show only: Outcomes + Drivers + Efficiency (collapsed by default but can be shown).
     - Hide Foundation + Marketing Activities + Effectiveness unless user enables them.
     - Show only PRIMARY edges by default.
  B) Builder:
     - Show all tiers by default.
     - Show both primary + secondary edges (still de-emphasized).
- Add quick buttons:
  - “Show all layers”
  - “Collapse to Executive”
  - “Reset view” (restores default layout + zoom)

GRAPH ORIENTATION / TIERING
- Use a left-to-right columnar layout (not bottom-to-top) for widescreen fit.
- Six tiers in order (left -> right or grouped columns; choose what fits best, but keep the narrative left-to-right):
  1) Marketing Activities (bottom-most conceptual layer)
  2) Foundation
  3) Effectiveness
  4) Efficiency
  5) Drivers
  6) Outcomes (top-level)

IMPORTANT: Keep tier colors consistent (one color per tier) and do not mix colors within a tier.
- Marketing Activities: light teal/mint
- Foundation: light blue
- Effectiveness: purple
- Efficiency: orange
- Drivers: green
- Outcomes: deep blue

NODES (DATA MODEL)
Represent each metric as a node with:
- id, label, tier, group (optional), shortLabel (optional), description (string), owner (Marketing/Sales/CS/Finance), cadence (Weekly/Monthly/etc), isPrimary (boolean).
Create a single “source of truth” JSON/TS object for:
- tiers (id, name, color)
- nodes
- edges

TIERS + CONTENT
Tier: Marketing Activities
- Paid Search (Google Ads)
- Paid Social (LinkedIn Ads)
- Organic Search (SEO)
- Content Marketing
- Email Marketing
- ABM (Account-Based Marketing)
- Events & Webinars
- Partner/Referral Programs

Tier: Foundation
- MQLs
- SQLs
- Lead Velocity Rate
- Cost Per Qualified Lead
- ARPA
- Expansion Revenue
- Sales Cycle Length

Tier: Effectiveness
- MQL-to-SQL Conversion
- Lead-to-Quote Conversion
- Quote-to-Close Rate
- Logo Retention Rate
- Gross Churn Rate
- Net Churn Rate

Tier: Efficiency
- CAC
- LTV
- LTV:CAC Ratio
- CAC Payback Period

Tier: Drivers
- NRR/NDR
- New ARR
- Gross Margin

Tier: Outcomes
- ARR/MRR
- Rule of 40

GROUPING (REDUCE COGNITIVE LOAD)
Implement “clusters” inside tiers as group containers (React Flow group/sub-flow nodes):
- Marketing Activities groups: Paid, Organic, Field, ABM/Targeted, Partner.
- Effectiveness groups: Pipeline Conversion, Retention/Churn.
Use React Flow group nodes (type: 'group') and nest children via parentId. Constrain child movement within parent using extent: 'parent' when applicable.
Each group should be collapsible:
- Collapsing a group hides child nodes and replaces them with a single “summary node” that remains connected (aggregate edges).
- Expanding restores child nodes and edges.

EDGES (CONNECTIONS)
Define directed edges upward in the causal story (left-to-right in the layout).
Marketing Activities -> Foundation:
- Each marketing activity connects to MQLs, SQLs, Lead Velocity Rate, Cost Per Qualified Lead.

Foundation -> Effectiveness:
- MQLs -> MQL-to-SQL Conversion
- SQLs -> Lead-to-Quote Conversion
- Lead Velocity Rate -> MQL-to-SQL Conversion AND Lead-to-Quote Conversion
- ARPA -> Logo Retention Rate, Net Churn Rate, Gross Churn Rate
- Expansion Revenue -> Logo Retention Rate, Net Churn Rate, Gross Churn Rate
- Sales Cycle Length -> Quote-to-Close Rate

Effectiveness -> Efficiency:
- MQL-to-SQL Conversion -> CAC
- Lead-to-Quote Conversion -> CAC
- Quote-to-Close Rate -> CAC
- Logo Retention Rate -> LTV
- Net Churn Rate -> LTV
- Gross Churn Rate -> LTV
- CAC + LTV -> LTV:CAC Ratio
- CAC -> CAC Payback Period

Efficiency -> Drivers:
- CAC -> New ARR
- LTV -> New ARR
- LTV:CAC Ratio -> New ARR
- CAC Payback Period -> New ARR
- LTV -> NRR/NDR

Drivers -> Outcomes:
- NRR/NDR -> ARR/MRR
- New ARR -> ARR/MRR
- ARR/MRR -> Rule of 40
- Gross Margin -> Rule of 40

EDGE VISUAL RULES
- Default: edges are low opacity (e.g., 0.25–0.35) and thin.
- Primary edges: slightly higher opacity (e.g., 0.45) and thicker.
- On hover of a node: highlight only its inbound/outbound edges and 1-hop neighbors; dim everything else.
- On click (select) node: lock highlight and show full upstream + downstream path; provide buttons “Trace to Outcomes” and “Trace to Sources”.
- Allow toggles:
  - Show Primary edges only (default ON in Executive mode)
  - Show Secondary edges

LAYOUT ENGINE
- Implement deterministic layout so it looks consistent on every load:
  - Each tier is a column.
  - Within tier, place groups stacked vertically; within group, place nodes stacked.
  - Fixed spacing tokens (e.g., column gap 220px, row gap 18px, group padding 16px).
- Provide a “Re-layout” button that recomputes positions after toggling visibility/collapsing.

INTERACTIONS
1) Controls bar (top):
   - Search input (typeahead)
   - Mode toggle (Executive / Builder)
   - Layer toggles (Marketing Activities, Foundation, Effectiveness, Efficiency)
   - Edge toggle (Primary only)
   - Reset view
   - Export PNG
2) Canvas:
   - Pan/zoom enabled
   - React Flow Controls component enabled (zoom in/out, fit view)
   - MiniMap enabled (optional, default ON in Builder, OFF in Executive)
3) Details panel (right):
   - When no selection: show short help + “What am I looking at?” legend (tier colors).
   - When node selected: show label, tier, definition, why it matters (1–2 lines), typical levers (list upstream nodes), owner, cadence.
   - Add actions:
     - “Highlight upstream”
     - “Highlight downstream”
     - “Copy link to KPI” (URL hash like #kpi=CAC)

ACCESSIBILITY / REDUCED MOTION
- Keyboard:
  - Search focus via /
  - Esc clears selection
  - Tab cycles through interactive UI controls; for nodes, provide accessible focus treatment and selection with Enter/Space where feasible.
- Add visible focus rings and ensure contrast is readable.
- Respect prefers-reduced-motion: disable animated edges; reduce zoom animations.

RESPONSIVE BEHAVIOR
- Desktop first.
- For <1024px width:
  - Switch to a simplified “tier tabs” view:
    - Tabs for each tier with a mini list of KPIs.
    - Selecting a KPI highlights its path in a simplified canvas or displays its upstream/downstream list.

IMPLEMENTATION DETAILS (REQUIRED)
- Use React Flow’s useNodesState/useEdgesState.
- Create custom node components:
  - MetricNode: colored by tier, shows shortLabel and an optional status dot placeholder.
  - GroupNode: labeled container with collapse/expand button.
- Centralize styles and constants (colors, spacing).
- Create selectors/utilities:
  - getUpstream(nodeId), getDownstream(nodeId)
  - getPathToOutcomes(nodeId)
  - applyVisibility(mode, layerToggles, collapsedGroups)
  - applyHighlight(selection/hover)
- Provide clean file structure:
  - /src/pages/MetricsMapPage.tsx (or Next.js page)
  - /src/components/MetricsMap/...
  - /src/components/MetricsMap/data.ts (nodes/edges/tiers)
  - /src/components/MetricsMap/layout.ts
  - /src/components/MetricsMap/graphUtils.ts
  - /src/components/MetricsMap/DetailsPanel.tsx
  - /src/components/MetricsMap/ControlsBar.tsx

DELIVERABLES
- Working React page rendering the dashboard with:
  - Correct tiers, nodes, edges
  - Consistent tier colors
  - Executive/Builder modes
  - Layer toggles + edge toggles
  - Search + jump-to-node
  - Hover + click highlight behavior
  - Details panel
  - Fit-to-view and reset
  - Export to PNG
- Include a short README section at the top of the main page/component describing how to add/edit nodes and edges.

BUILD QUALITY
- No placeholder “TODO” for core behaviors (layout, toggles, highlight, details panel).
- Keep it performant (memoize node renderers; avoid re-rendering full graph on hover).
- Make the UI look like a real executive dashboard: clean spacing, restrained styling, clear typography.

Now implement it.
