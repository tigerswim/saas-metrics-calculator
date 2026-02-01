# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SaaS Metrics Calculator** - an interactive web application for modeling SaaS business metrics. Users input their business parameters and see 50+ calculated metrics update in real-time, including ARR growth, retention rates, CAC/LTV ratios, and other critical KPIs.

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
   - Supports two view modes: Sections view and Metrics Map view
   - Removed legacy Classic metrics map - now uses unified VerticalMetricsMap
3. **Calculation Engine**: `app/utils/calculator.ts`
   - Pure functions: `calculateMetrics()` and `getKeyMetrics()`
   - All business logic and formulas are here
   - Takes Inputs, returns CalculatedMetrics
4. **Display Components**:
   - **Sections View**:
     - `InputPanel.tsx`: Collapsible input groups organized by category
     - `MetricsDisplay.tsx`: Traditional grid layout of calculated metrics
   - **Metrics Map View** (v2):
     - `VerticalMetricsMap.tsx`: Interactive visualization showing metric relationships
     - `MetricCardV2.tsx`: Individual metric cards with status, sparklines, and efficiency metrics
     - `RelationshipPanel.tsx`: Slideout panel showing metric connections and formulas
5. **Utility Modules**:
   - `metricsGraph.ts`: Defines metric relationships and connections
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
- **CalculatedMetrics**: 50+ calculated metrics across categories:
  - ARR & Growth
  - Retention (GRR, NRR, Churn)
  - Pipeline (SQLs, Opportunities, Deals Won)
  - Marketing Efficiency (CAC, Cost/Lead, Cost/MQL, Cost/SQL, CPM, CPC, CTR)
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

The calculator features an interactive **Metrics Map** (v2) that visualizes metric relationships:

### Metric Cards
- **Primary Cards**: Larger cards with embedded efficiency/effectiveness metrics
  - Display main metric value with sparkline trends
  - Show week-over-week change percentages
  - Include efficiency badges (e.g., CPM on Impressions, CPC/CTR on Clicks)
  - Color-coded status indicators (good/warning/bad)
- **Standard Cards**: Regular metrics without efficiency sub-metrics
- **Card Alignment**: Fixed-height sections ensure values align horizontally across rows
- **Status Badges**: Positioned at bottom-right of cards

### Efficiency Metrics Display
- Embedded as oval-shaped status indicators within parent metric cards
- Wider oval shape (w-4 h-2) for better color visibility
- Examples:
  - **Impressions card**: Shows CPM efficiency
  - **Clicks card**: Shows CPC and CTR effectiveness
  - **Leads card**: Shows Cost/Lead efficiency
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
- Target labels displayed in UI (e.g., "< $50" for Cost/Lead)
- `getMetricStatus()`: Evaluates metric against thresholds
- `getCalculatedMetricStatus()`: Wrapper for calculated metrics
- Examples:
  - **Cost/Lead**: Good < $50, Warning $50-$100, Bad > $100
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
3. Leads (with Cost/Lead efficiency)
4. MQLs (with Cost/MQL efficiency)
5. SQLs (with Cost/SQL efficiency)
6. Opportunities
7. Deals Won

**Pipeline Metrics**: Pipeline Value, Pipeline Velocity, Pipeline Conversion

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
- GRR (Monthly)
- GRR (Annual)
- NRR (Monthly)
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
- Unit Economics: CAC Blended, CAC Paid Only, LTV
- Efficiency Ratios: LTV:CAC Ratio, Magic Number, Quick Ratio, Burn Multiple
- Time-based: CAC Payback Period, S&M Payback Period

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

### Adding Metric to Metrics Map

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

- **Beginning ARR** is in millions ($M) - multiply by 1000 for calculations
- **Marketing/S&M Spend** inputs are in thousands ($K)
- **Cost-per metrics** are calculated and returned in actual dollars from calculator.ts:
  - Cost/Lead, Cost/MQL, Cost/SQL: `(marketingSpend * 1000) / count`
  - CPC: `(paidMarketingSpend * 1000) / clicks`
  - CPM: `(paidMarketingSpend / impressions) * 1000`
  - **Display**: Use directly without conversion: `Math.round(value).toLocaleString()`
- **CAC metrics** (cacBlended, cacPaidOnly) are returned in $K from calculator.ts:
  - **Display**: Convert to dollars with `Math.round(value * 1000).toLocaleString()`
- **Financial metrics** (grossProfit, totalOpEx, ebitda) are returned in $K from calculator.ts:
  - **Display**: Convert to dollars with `Math.round(value * 1000).toLocaleString()`
- **ARR metrics** (netNewARR, monthlyRevenue, pipelineGenerated) are returned in $K from calculator.ts:
  - **Display**: Convert to dollars with `value * 1000` in display components
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
- Used for Cost/Lead, Cost/MQL, Cost/SQL calculations
- Formula: `(marketingSpend * 1000) / count` to get cost in actual dollars

**Cost Metrics** (all in actual dollars):
- `costPerLead = (marketingSpend * 1000) / leadsGenerated`
- `costPerMQL = (marketingSpend * 1000) / mqlsGenerated`
- `costPerSQL = (marketingSpend * 1000) / sqlsGenerated`
- `cpc = (paidMarketingSpend * 1000) / paidClicks`

**Display Formatting** (see `metricsMapUtils.ts`):
- Cost-per metrics: `Math.round(value).toLocaleString()` (already in $)
- CAC metrics: `Math.round(value * 1000).toLocaleString()` (convert from $K)

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
│   │   ├── VerticalMetricsMap.tsx  # Interactive metrics visualization
│   │   ├── MetricCardV2.tsx        # Individual metric cards with status
│   │   └── RelationshipPanel.tsx   # Slideout panel for metric details
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

## Notes

- No backend or API - entirely client-side
- No data persistence - all state is in-memory
- No authentication or user accounts
- Responsive design works on mobile/tablet/desktop
- All calculations update instantly (no debouncing/throttling)
