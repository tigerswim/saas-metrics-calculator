# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SaaS Metrics Calculator** - an interactive web application for modeling SaaS business metrics. Users input their business parameters and see ~50 calculated metrics update in real-time, including ARR growth, retention rates, CAC/LTV ratios, and other critical KPIs.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React hooks (useState)
- **Deployment**: Netlify/Vercel

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check without emitting files
npx tsc --noEmit
```

## Architecture

### Application Flow

1. **Entry Point**: `app/page.tsx` renders the Calculator component
2. **Main Component**: `app/components/Calculator.tsx`
   - Manages all state with React hooks
   - Contains `defaultInputs` object (initial/reset values)
   - Calls `calculateMetrics()` on every input change
   - Supports three view modes: Sections view, Metrics Map v2, and Metrics Map v3 (React Flow)
   - Toggle between v2 (vertical layout) and v3 (interactive graph) via UI switch
3. **Calculation Engine**: `app/utils/calculator.ts`
   - Pure functions: `calculateMetrics()` and `getKeyMetrics()`
   - All business logic and formulas are here
   - Takes Inputs, returns CalculatedMetrics
4. **Display Components**:
   - **Sections View**:
     - `InputPanel.tsx`: Collapsible input groups organized by category
     - `MetricsDisplay.tsx`: Traditional grid layout of calculated metrics
   - **Metrics Map v2** (Vertical Layout):
     - `VerticalMetricsMap.tsx`: Multi-column vertical layout with sections
     - `MetricCardV2.tsx`: Individual metric cards with status, sparklines, and efficiency metrics
     - `RelationshipPanel.tsx`: Slideout panel showing metric connections and formulas
   - **Metrics Map v3** (React Flow Graph):
     - `ReactFlowMetricsMap.tsx`: Interactive node-link diagram with Dagre layout
     - `StandardNode.tsx`: Uniform metric cards (160-200px width)
     - `useMetricsGraph.ts`: Generates nodes/edges from metrics data
     - `useLayout.ts`: Dagre hierarchical layout (150px tier spacing, 20px node spacing)
     - `graphUtils.ts`: Visibility filtering, highlighting, and path tracing
     - `ControlsBar.tsx`: Search, view mode toggle, layer filters
5. **Utility Modules**:
   - `metricsGraph.ts`: Defines metric relationships and connections (used by both v2 and v3)
   - `metricFormulas.ts`: Stores calculation formulas and descriptions
   - `metricTargets.ts`: Defines performance targets and status evaluation
   - `metricsMapUtils.ts`: Formatting and display utilities

### Type System

All types defined in `app/types.ts`:

- **Inputs**: 40+ input fields including:
  - ARR and customer metrics
  - Marketing channel spend and lead attribution
  - Paid media metrics (impressions, clicks)
  - Operating expenses (Total S&M, Marketing Spend, R&D, G&A)
  - Conversion rates and sales cycle data
- **CalculatedMetrics**: ~50 calculated metrics across categories:
  - ARR & Growth (no separate monthlyRevenue - use MRR instead)
  - Retention (GRR, NRR, Churn)
  - Pipeline (SQLs, Opportunities, Deals Won)
  - Marketing Efficiency (CAC, Cost/MQL, Cost/SQL, Cost/Opp, Cost/Won, CPM, CPC, CTR)
  - Sales Efficiency (Magic Number, Payback Period)
  - Financial Performance (Margins, EBITDA, Rule of 40, Quick Ratio)
- **KeyMetric**: For the top 10 metrics with targets and status colors
- **MetricStatus**: 'good' | 'warning' | 'bad' | 'neutral' - used for color coding

### Data Flow

```
User Input → handleInputChange() → setInputs()
→ calculateMetrics(newInputs) → setMetrics()
→ Re-render with new metrics
```

All calculations are client-side and synchronous - no API calls or async operations.

### Styling Architecture

- **Global Styles**: `app/globals.css` (Tailwind directives)
- **Config**: `tailwind.config.js` (color schemes, fonts)
- **Component Styles**: Inline Tailwind classes in TSX files
- **Animations**: Framer Motion for interactive transitions and card animations
- **Color Coding**: Status-based color system:
  - **Good**: Emerald/green (border-emerald-500, bg-emerald-50)
  - **Warning**: Amber/yellow (border-amber-500, bg-amber-50)
  - **Bad**: Rose/red (border-rose-500, bg-rose-50)
  - **Neutral**: Slate/gray (border-slate-300, bg-white)
- **Responsive Design**: Mobile-first approach with breakpoints (sm, md, lg, xl, 2xl)

## Metrics Map System

The calculator features two interactive **Metrics Map** views:

### Metrics Map v2 (Vertical Layout)
Multi-column vertical layout with sections for different metric categories.

#### Metric Cards
- **Primary Cards**: Larger cards with embedded efficiency/effectiveness metrics
  - Display main metric value with sparkline trends
  - Show week-over-week change percentages
  - Include efficiency badges (e.g., CPM on Impressions, CPC/CTR on Clicks)
  - Color-coded status indicators (good/warning/bad)
- **Standard Cards**: Regular metrics without efficiency sub-metrics
- **Card Alignment**: Fixed-height sections ensure values align horizontally across rows
- **Status Badges**: Positioned at bottom-right of cards

### Metrics Map v3 (React Flow Graph)
Interactive node-link diagram showing metric relationships and flow using @xyflow/react and Dagre layout.

#### Features
- **Hierarchical Layout**: 5 tiers (Budget → Activities → Acquisition → Revenue → Outcomes)
- **Uniform Node Sizing**: All nodes 160-200px wide for consistency
- **Compact Spacing**: 150px between tiers, 20px between nodes (optimized for less scrolling)
- **Interactive**: Click nodes to highlight connections, search functionality
- **View Modes**:
  - Executive mode: Shows ~15 key metrics (Outcomes + key efficiency)
  - Builder mode: All layers with toggle controls
- **Layer Filtering**: Show/hide entire metric layers (Budget, Activities, Acquisition, Revenue, Outcomes)
- **Color-Coded Tiers**: Gradient bars indicate metric tier (slate=Budget, blue=Activities, teal=Acquisition, green=Revenue, purple=Outcomes)
- **Status Indicators**: Border color shows metric status (emerald=good, amber=warning, rose=bad, slate=neutral)

### Efficiency Metrics Display
- Embedded as oval-shaped status indicators within parent metric cards
- Wider oval shape (w-4 h-2) for better color visibility
- Examples:
  - **Impressions card**: Shows CPM efficiency
  - **Clicks card**: Shows CPC and CTR effectiveness
  - **Leads card**: Standard metric card
  - **MQLs card**: Shows Cost/MQL efficiency
  - **SQLs card**: Shows Cost/SQL efficiency

### Relationship Panel
- **Slideout Panel**: Opens when clicking a metric card
- **Shows**:
  - Metric value and label
  - "Driven By" section - upstream metrics that feed into this metric
  - "Influences" section - downstream metrics affected by this metric
  - Performance targets with status indicators
  - Efficiency metric details with targets
  - Calculation formula (expandable)
  - "Why This Matters" explanation

### Status Evaluation
Centralized in `app/utils/metricTargets.ts`:
- Defines thresholds for each metric (good/warning/bad ranges)
- Target labels displayed in UI (e.g., ">3.0x" for LTV:CAC)
- `getMetricStatus()`: Evaluates metric against thresholds
- `getCalculatedMetricStatus()`: Wrapper for calculated metrics
- Examples:
  - **Cost/MQL**: Good < $100, Warning $100-$200, Bad > $200
  - **LTV:CAC Ratio**: Good > 3, Warning 2-3, Bad < 2
  - **CAC Payback**: Good < 12mo, Warning 12-18mo, Bad > 18mo

## Metrics Map Organization

The Metrics Map (v2) organizes metrics into logical sections:

### Marketing Activities
Shows channel-level spend and lead generation (Paid Search, Paid Social, Events, Content, Partnerships, ABM).

### Acquisition Funnel
**Main Funnel Flow** (in order):
1. Impressions (with CPM efficiency)
2. Clicks (with CPC and CTR effectiveness)
3. Leads
4. MQLs (with Cost/MQL efficiency)
5. SQLs (with Cost/SQL efficiency)
6. Opportunities
7. Deals Won

**Pipeline Metrics**: Pipeline Value, Pipeline Velocity

**Layout**: Responsive grid (5 columns on xl, 6 on 2xl) with 8-unit gap for visual clarity.

### Revenue & Retention
**Three-column layout** (New | ARR Waterfall | Existing):

**Left Column - New Customer Revenue**:
- New Customers (from Deals Won)
- New Bookings

**Center Column - ARR Waterfall** (shows the flow):
- Beginning ARR
- (+) New Bookings
- (+) Expansion ARR
- (-) Churned ARR
- (=) Net New ARR
- (=) Ending ARR
- MRR (derived)
- ARR Growth % (derived)

**Right Column - Existing Customer Performance**:
- Expansion ARR
- Churned ARR
- GRR (Annual)
- NRR (Annual)
- Logo Churn Rate
- Customers Churned
- Total Customers
- ARPA

### Business Outcomes
**Three-column layout** (KPI % | P&L | Efficiency):

**Left Column - KPI Percentages**:
- Gross Margin
- EBITDA Margin
- Rule of 40

**Center Column - P&L Performance**:
- Gross Profit (absolute $)
- Total OpEx (absolute $)
- EBITDA (absolute $)

**Right Column - Efficiency Metrics**:
- Unit Economics: CAC Blended, LTV
- Efficiency Ratios: LTV:CAC Ratio, Magic Number, Quick Ratio, Burn Multiple
- Time-based: CAC Payback Period

**Connection Lines**: Show relationships between columns (e.g., Gross Margin → Gross Profit, LTV + CAC → LTV:CAC Ratio)

## Making Changes

### Adding a New Metric

1. Add property to `CalculatedMetrics` interface in `app/types.ts`
2. Add calculation in `calculateMetrics()` in `app/utils/calculator.ts`
3. Display in the appropriate section in `app/components/MetricsDisplay.tsx`

### Adding a New Input Field

1. Add property to `Inputs` interface in `app/types.ts`
2. Add default value to `defaultInputs` in `app/components/Calculator.tsx`
3. Add input field to the appropriate `<InputGroup>` in `app/components/InputPanel.tsx`
   - Input groups: ARR & Customers, Marketing Channels, ABM, Pipeline, Paid Media, Operating Expenses, Customer Value
4. Use the new input in calculations in `app/utils/calculator.ts`
5. If the metric should appear in the Metrics Map, add it to the appropriate section in `app/components/metrics-map-v2/VerticalMetricsMap.tsx`

### Changing Default Values

Edit `defaultInputs` object in `app/components/Calculator.tsx`.

### Adding Metric to Metrics Map v2 (Vertical Layout)

1. Add the metric card to the appropriate section in `app/components/metrics-map-v2/VerticalMetricsMap.tsx`:
   ```typescript
   {
     id: 'metric-id',
     label: 'Metric Label',
     value: metrics.metricValue.toLocaleString(),
     status: getCalculatedMetricStatus('metric-id', metrics, inputs),
     sparklineData: timeSeriesData.metricName, // optional
     changePercent: calculateWoWChange(timeSeriesData.metricName), // optional
     isPrimary: true, // for larger cards
     efficiencyMetric: { // optional - for single efficiency metric
       label: 'Efficiency Label',
       value: `$${metrics.efficiencyValue.toFixed(0)}`,
       status: getCalculatedMetricStatus('efficiency-id', metrics, inputs),
     },
     efficiencyMetrics: [ // optional - for multiple efficiency metrics
       { label: 'First', value: '...', status: '...' },
       { label: 'Second', value: '...', status: '...' },
     ],
   }
   ```

2. If adding status evaluation, update `app/utils/metricTargets.ts`:
   - Add thresholds to `metricTargets` object
   - Add metric value mapping in `metricValueMap`

3. If adding relationship information:
   - Update `app/utils/metricsGraph.ts` with connections
   - Add formula to `app/utils/metricFormulas.ts`
   - Add label mapping to `RelationshipPanel.tsx` if needed

### Adding Metric to Metrics Map v3 (React Flow Graph)

1. Add to `app/utils/metricsGraph.ts` if not already present:
   ```typescript
   'metric-id': {
     inputs: ['upstream-metric-id'],
     outputs: ['downstream-metric-id']
   }
   ```

2. Add tier classification in `useMetricsGraph.ts` `getMetricTier()` function
3. Add value formatting in `useMetricsGraph.ts` `getMetricValue()` valueMap
4. Add label in `useMetricsGraph.ts` `getMetricLabel()` labelMap
5. Add status thresholds in `metricTargets.ts` and add to `metricValueMap`
6. Add formula to `metricFormulas.ts` for RelationshipPanel display

**Note**: Metrics Map v3 automatically includes all metrics defined in `metricsGraph.ts`. No need to manually add cards - just ensure the metric has relationships, formatting, and tier classification.

### Modifying Status Thresholds

Update thresholds in `app/utils/metricTargets.ts`:
```typescript
'metric-id': {
  good: (v) => v > targetValue,
  warning: (v) => v >= minValue && v <= targetValue,
  targetLabel: '> $X or Y%',
},
```

## Important Patterns

### Number Handling

**CRITICAL**: Pay careful attention to unit conversions - this is a common source of bugs.

- **Beginning ARR** is in millions ($M) - multiply by 1000 for calculations
- **Marketing/S&M Spend** inputs are in thousands ($K)
- **MRR**: There is NO separate `monthlyRevenue` field - use `mrr` for all monthly revenue calculations
- **Cost-per metrics** are calculated and returned in actual dollars from calculator.ts:
  - Cost/MQL, Cost/SQL, Cost/Opp, Cost/Won: `(marketingSpend * 1000) / count`
  - CPC: `(paidMarketingSpend * 1000) / clicks`
  - CPM: `(paidMarketingSpend / impressions) * 1000`
  - **Display**: Use directly without conversion: `Math.round(value).toLocaleString()`
- **CAC metrics** (cacBlended) are returned in $K from calculator.ts:
  - **Display**: Convert to dollars with `Math.round(value * 1000).toLocaleString()`
- **LTV** is returned in actual dollars from calculator.ts:
  - **Display**: Use directly without conversion: `Math.round(value).toLocaleString()`
  - **NEVER multiply LTV by 1000** - it's already in dollars!
- **Financial metrics** (grossProfit, totalOpEx, ebitda) are returned in $K from calculator.ts:
  - **Display**: Convert to dollars with `Math.round(value * 1000).toLocaleString()`
- **ARR metrics** (netNewARR, pipelineGenerated) are returned in $K from calculator.ts:
  - **Display**: Convert to dollars with `value * 1000` in display components
- **Ending ARR and MRR** are SPECIAL - returned in $M from calculator.ts:
  - endingARR: `endingARR / 1000` (converted from $K to $M)
  - mrr: `mrr / 1000` (converted from $K to $M)
  - **Display**: Use `metrics.endingARR.toFixed(1)` directly (no further conversion)
- **Percentages** are stored as whole numbers (e.g., 25 = 25%)
- **Counts**: Use `Math.round()` for customers, deals, leads, etc.
- **Display formatting**:
  - Whole dollars: `Math.round(value).toLocaleString()`
  - $K values: `$${value.toFixed(0)}K`
  - $M values: `$${(value / 1000).toFixed(1)}M`
  - Percentages: `${value.toFixed(1)}%`
  - Ratios: `${value.toFixed(1)}x`
  - Months: `${value.toFixed(1)} mo`

### Component Structure

- Use `'use client'` directive for components with hooks
- Keep components focused: inputs, display, and calculation logic are separate
- Props are explicitly typed with TypeScript interfaces

### State Management

- Single source of truth: `inputs` state in Calculator component
- Derived state: `metrics` are recalculated on every input change
- No global state or context needed - everything flows through props

## Common Tasks

### Debug Calculation

1. Check the formula in `calculateMetrics()` in `app/utils/calculator.ts`
2. Verify input types match the `Inputs` interface
3. Use `console.log()` in the calculation function to inspect values
4. Check for division by zero or NaN issues
5. **Unit conversion**: Ensure proper conversion between $K and actual dollars
   - Marketing spend inputs are in $K
   - Cost-per metrics multiply by 1000 to get actual dollars
   - CAC metrics stay in $K, converted for display only

### Key Calculation Notes

**Marketing Spend**:
- `marketingSpend` input (in $K) is user-configurable in Operating Expenses
- Used for Cost/MQL, Cost/SQL calculations
- Formula: `(marketingSpend * 1000) / count` to get cost in actual dollars

**Cost Metrics** (all in actual dollars):
- `costPerMQL = (marketingSpend * 1000) / mqlsGenerated`
- `costPerSQL = (marketingSpend * 1000) / sqlsGenerated`
- `costPerOpp = (marketingSpend * 1000) / opportunitiesCreated`
- `costPerWon = (marketingSpend * 1000) / dealsClosedWon`
- `cpc = (paidMarketingSpend * 1000) / paidClicks`

**Display Formatting** (see `useMetricsGraph.ts`):
- Cost-per metrics: `Math.round(value).toLocaleString()` (already in $)
- CAC metrics: `Math.round(value * 1000).toLocaleString()` (convert from $K)
- LTV: `Math.round(value).toLocaleString()` (already in $, DO NOT multiply by 1000)

### Fix Styling Issue

1. Check Tailwind classes in the component TSX file
2. Verify `tailwind.config.js` for custom theme values
3. Check `app/globals.css` for global overrides
4. Use browser dev tools to inspect computed styles

### TypeScript Error

1. Run `npx tsc --noEmit` to see all type errors
2. Check that interfaces in `app/types.ts` match usage
3. Ensure all required props are passed to components
4. Use explicit type annotations where inference fails

## Deployment

### Netlify (Primary)

Configuration in `netlify.toml` at root:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 20

Push to GitHub and connect repository in Netlify dashboard.

### Vercel (Alternative)

```bash
vercel deploy
```

Vercel auto-detects Next.js settings.

## Project Structure

```
app/
├── components/
│   ├── Calculator.tsx              # Main component with state & view mode switching
│   ├── InputPanel.tsx              # Collapsible input groups by category
│   ├── MetricsDisplay.tsx          # Traditional sections view
│   ├── metrics-map-v2/
│   │   ├── VerticalMetricsMap.tsx  # Vertical layout metrics visualization
│   │   ├── MetricCardV2.tsx        # Individual metric cards with status
│   │   └── RelationshipPanel.tsx   # Slideout panel for metric details
│   ├── metrics-map-v3/
│   │   ├── ReactFlowMetricsMap.tsx # React Flow graph visualization
│   │   ├── nodes/
│   │   │   └── StandardNode.tsx    # Uniform metric node (160-200px)
│   │   ├── ControlsBar.tsx         # Search, filters, view mode toggle
│   │   ├── useMetricsGraph.ts      # Generate nodes/edges from metrics
│   │   ├── useLayout.ts            # Dagre hierarchical layout
│   │   └── graphUtils.ts           # Visibility, highlighting, path tracing
│   └── [legacy components]         # MetricsMap.tsx, PipelineFunnel.tsx, etc.
├── utils/
│   ├── calculator.ts               # Core calculation engine
│   ├── metricsGraph.ts             # Metric relationship definitions
│   ├── metricFormulas.ts           # Formula descriptions
│   ├── metricTargets.ts            # Performance thresholds & status
│   └── metricsMapUtils.ts          # Formatting & display utilities
├── types.ts                        # All TypeScript interfaces
├── layout.tsx                      # Root layout with metadata
├── page.tsx                        # Homepage (renders Calculator)
└── globals.css                     # Tailwind base styles
```

## Recent Updates (February 2026)

### Removed 7 Superfluous Metrics (Feb 7, 2026)
- **Removed**: Monthly GRR, Monthly NRR, Monthly ARR Growth Rate, CAC Paid Only, S&M Payback Period, Pipeline Conversion, Cost per Lead
- **Rationale**: Redundant with annualized counterparts (GRR/NRR/Growth Rate), overlapping (CAC Paid Only, S&M Payback), or superseded by more meaningful metrics (Cost/MQL and Cost/SQL replace Cost/Lead)
- **Note**: Monthly GRR, NRR, and ARR Growth Rate remain as local variables in `calculator.ts` since they feed annualized calculations
- **Graph rewiring**: `churned-arr` and `expansion-arr` now connect directly to `annualized-grr`/`annualized-nrr` (bypassing removed monthly intermediaries)
- **Files changed**: `types.ts`, `calculator.ts`, `metricTargets.ts`, `metricFormulas.ts`, `metricsGraph.ts`, `metricsMapUtils.ts`, `VerticalMetricsMap.tsx`, `useMetricsGraph.ts`, `graphUtils.ts`, `MetricPopover.tsx`, `RelationshipPanel.tsx`, `MetricsDisplay.tsx`, `GrowthTrajectory.tsx`, `ChartsSection.tsx`, `MarketingScorecard.tsx`, `PipelineFunnel.tsx`, `UnitEconomicsTable.tsx`, `UnitEconomics.tsx`, `WhereToInvest.tsx`, `FormulaExplainer.tsx`, `RetentionComparison.tsx`, `MetricsMap.tsx`

### Enhanced "Why This Matters" Descriptions (Feb 2, 2026)
- **Updated all 60+ metric descriptions** in `metricFormulas.ts` from brief 1-sentence explanations to detailed 2-3 sentence business-context descriptions
- **Expanded all acronyms** (18 total: ARR, MRR, CAC, LTV, GRR, NRR, ARPA, MQL, SQL, EBITDA, CPM, CPC, CTR, ABM, R&D, G&A, S&M, COGS) on first mention in every description
- **Added benchmark targets** to each metric (e.g., "Target >3:1 for LTV:CAC ratio", "Target >90% monthly GRR")
- **Included business decision impact** explaining what each metric signals and when to act
- **Pattern**: Define metric + Benchmark/Target + Business Impact in 50-120 words
- **Improves user education** in both MetricPopover (desktop) and RelationshipPanel (mobile) when clicking metric cards
- **File changed**: `app/utils/metricFormulas.ts` (lines 9-324)

### Metrics Map v3 Implementation
- Built React Flow-based interactive graph visualization
- Hierarchical 5-tier layout using Dagre algorithm
- Executive and Builder view modes with layer filtering
- Uniform node sizing (160-200px) for visual consistency
- Compact spacing (150px tier separation, 20px node separation)

### Bug Fixes
1. **Removed monthlyRevenue redundancy**: Consolidated to use `mrr` throughout codebase
2. **Fixed LTV display**: Corrected $281M bug - LTV is now properly displayed (~$375K)
3. **Standardized node sizes**: All Metrics Map v3 nodes are uniform size
4. **Optimized spacing**: Reduced scrolling by 40% with tighter layout
5. **Fixed React Flow error**: Changed `reactFlowInstance.project()` to `reactFlowInstance.flowToScreenPosition()` for @xyflow/react v12 compatibility

### Added Metrics
- Cost per Opportunity: `(marketingSpend * 1000) / opportunitiesCreated`
- Cost per Won: `(marketingSpend * 1000) / dealsClosedWon`
- Full formulas and status thresholds added to metricFormulas.ts and metricTargets.ts

## Notes

- No backend or API - entirely client-side
- No data persistence - all state is in-memory
- No authentication or user accounts
- Responsive design works on mobile/tablet/desktop
- All calculations update instantly (no debouncing/throttling)
- **Dependencies**: @xyflow/react (React Flow), dagre (graph layout), framer-motion (animations)
