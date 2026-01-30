# Metrics Map Redesign: Interactive Vertical Flow

**Date**: 2026-01-30
**Status**: Design Complete - Ready for Implementation
**Goal**: Transform the Metrics Map into an intuitive, interactive visualization that helps users understand how metrics connect and influence each other

---

## Problem Statement

The current calculator has extensive metrics (50+) organized in horizontal sections. Users struggle to:
- Understand relationships and causality between metrics
- See how changing one input affects downstream outcomes
- Navigate the dense information architecture

The existing Metrics Map shows basic flows but lacks interactivity and visual clarity for exploring metric relationships.

---

## Design Goals

1. **Make causality intuitive** - Visual flow should mirror how business activities drive outcomes
2. **Enable exploration** - Users can click any metric to understand what drives it and what it affects
3. **Reduce cognitive load** - Progressive disclosure and focus modes prevent overwhelm
4. **Maintain professionalism** - Sophisticated visual design with tasteful animations
5. **Work everywhere** - Responsive design from mobile to desktop

---

## Solution Overview

Transform the Metrics Map from horizontal sections to a **vertical waterfall layout** with **click-to-focus interactions** that reveal two degrees of metric relationships.

### Core Interaction Model

**Click any metric card** → Enter focus mode:
- Selected metric remains bright with colored border
- Direct connections (1st degree): 80% opacity, animated flow lines
- Secondary connections (2nd degree): 60% opacity, subtle lines
- Everything else: 20% opacity, desaturated
- Relationship panel slides in showing inputs, outputs, formulas

**Click again, press ESC, or click elsewhere** → Exit focus mode

---

## Information Architecture

### Four-Layer Vertical Structure

Metrics cascade top-to-bottom through four distinct layers:

#### 1. Activities Layer
**What you do** - Marketing spend, sales efforts, operational inputs

**Metrics include:**
- S&M Spend (total)
- Marketing Spend (by channel)
- Sales Headcount
- R&D Spend
- G&A Spend

**Visual theme:** Cool blue gradient (strategic planning)

#### 2. Acquisition Layer
**How you acquire customers** - Complete funnel from awareness to close

**Metrics include:**
- Impressions → Clicks → Leads
- MQLs → SQLs → Opportunities → Wins
- Conversion rates at each stage
- Cost per stage (CPM, CPC, Cost/Lead, Cost/MQL, Cost/SQL, etc.)

**Visual theme:** Teal to cyan gradient (active, flowing)

#### 3. Revenue Layer
**How revenue is generated and retained**

**Metrics include:**
- New Bookings
- Expansion ARR
- Churned ARR
- Net New ARR
- Ending ARR
- GRR / NRR
- Logo Churn
- Ending Customer Count

**Visual theme:** Green gradient (growth, money)

#### 4. Outcomes Layer
**Business health and efficiency metrics**

**Sub-sections:**
- Unit Economics (CAC, LTV, LTV:CAC, Payback Period)
- Sales Efficiency (Magic Number, Quick Ratio)
- Financial Performance (Gross Margin, EBITDA, EBITDA Margin)
- Key KPIs (Rule of 40, ARR Growth Rate)

**Visual theme:** Purple to indigo gradient (executive insights)

---

## Visual Design System

### Metric Card Design

**Compact, information-dense cards:**

**Structure:**
- Header: Metric label (bold, 13px) + info icon for tooltip
- Value: Large number (24px, tabular figures), properly formatted
- Sparkline: 8-week trend (40px × 20px) below value
- Change indicator: Badge showing WoW change with color coding
- Status indicator: 4px left border (green/amber/red/gray)

**Dimensions:**
- Width: 140-180px
- Height: Auto (adjusts to content)
- Padding: 16px
- Border radius: 8px
- Background: White with subtle shadow

**Interactive states:**
- Default: Subtle shadow
- Hover: Increased shadow, lift effect
- Selected (focus mode): 1.05x scale, colored border matching layer gradient
- Dimmed: Reduced opacity + desaturation

### Connection Lines

**Visual properties:**
- Smooth Bezier curves (not straight lines)
- 2-3px stroke for primary, 1px for secondary
- Color inherits from source metric's layer gradient
- Animated flow: Dots/dashes traveling along path (2-3s cycle)

**Connection types:**
- Input connections: Flow FROM parent metrics (above)
- Output connections: Flow TO child metrics (below)
- Lateral connections: Same-level influences (rare)

**Labels on connections:**
- Conversion rates (e.g., "42% MQL→SQL")
- Calculated values (e.g., "$1,250 Cost/SQL")
- Small badge positioned mid-line

### Layer Headers

**Desktop/Tablet:**
- Full-width gradient bar
- Layer name + icon + description
- Acts as visual separator between stages

**Mobile:**
- Becomes accordion trigger
- Shows metric count badge
- Chevron indicates expand/collapse state

### Color Palette

**Layer gradients:**
```
Activities:   #1e40af → #3b82f6 (blue)
Acquisition:  #0d9488 → #06b6d4 (teal)
Revenue:      #059669 → #10b981 (green)
Outcomes:     #7c3aed → #6366f1 (purple)
```

**Status colors:**
```
Good:     #10b981 (emerald-500)
Warning:  #f59e0b (amber-500)
Bad:      #ef4444 (red-500)
Neutral:  #64748b (slate-500)
```

---

## Animation & Interaction Design

### Idle State (No Focus)

**Subtle, professional movement:**
- Sparklines fade in on scroll into view
- Connection lines have slow flow animation (4-5s cycle)
- Metrics with significant WoW changes pulse gently every few seconds
- Cards needing attention have soft glow on status border

### Focus Mode Animation Sequence

**400ms total duration:**

1. **0-100ms**: Selected card scales to 1.05x, gains colored border
2. **100-200ms**: 1st degree connections become prominent, flow animations intensify
3. **200-300ms**: 2nd degree connections appear with reduced opacity
4. **300-400ms**: Unrelated elements fade to 20% with desaturation
5. **400ms+**: Relationship panel slides in from right (300ms slide)

**Exit animation:** Reverses sequence in ~300ms

### Performance Guidelines

- Use CSS transforms (GPU-accelerated)
- Connection animations use `stroke-dasharray`/`stroke-dashoffset`
- Pre-render sparkline SVG paths
- Debounce focus changes (prevent rapid click chaos)
- Respect `prefers-reduced-motion` media query

---

## Focus Mode Relationship Display

### Two Degrees of Separation

**When metric is clicked, show:**

**1st Degree (Direct connections):**
- Immediate inputs (what drives this metric)
- Immediate outputs (what this metric drives)
- Full color, 80% opacity, animated flow lines

**2nd Degree (Context):**
- What drives the inputs
- What the outputs affect
- Desaturated, 60% opacity, subtle lines

**Example: User clicks "CAC (Blended)"**
- **1st degree inputs**: S&M Spend, New Customers Added
- **1st degree outputs**: LTV:CAC Ratio, Payback Period
- **2nd degree inputs**: Marketing Spend (by channel), Sales Headcount → S&M Spend
- **2nd degree outputs**: LTV:CAC → Rule of 40, Business Health

### Relationship Panel

**Slides in from right (300px wide on desktop):**

**Content sections:**
1. **Header**: Selected metric name + value
2. **Driven by**: List of input metrics with current values
3. **Influences**: List of output metrics with current values
4. **Formula**: Expandable "How is this calculated?" section
5. **Definition**: Brief explanation from metric definitions library
6. **Close button**: X in top-right corner

**Mobile behavior:**
- Appears as bottom sheet (slides up from bottom)
- Takes 60% of screen height
- Swipe down to dismiss

---

## Navigation & Usability Enhancements

### Reorganized Header

**Desktop (≥1024px):**
- Left: Persona pills (All, CEO, CFO, Sales, Mktg) - full labels
- Center: "SaaS Metrics Calculator" + view description
- Right: View toggle (Sections/Map) + Configure + Reset

**Tablet (768-1023px):**
- Left: Persona pills with abbreviated labels
- Center: View description only (compressed)
- Right: Icon-only buttons with tooltips

**Mobile (<768px):**
- Two-row sticky header:
  - Row 1: Persona dropdown + Configure button
  - Row 2: View toggle + Reset button

### Metric Search (NEW)

**Keyboard shortcut:** CMD/CTRL+K

**Features:**
- Modal overlay with centered search box
- Fuzzy search across all metric names
- Shows metric name, current value, location (layer/section)
- Click result to scroll + enter focus mode
- ESC to close

**Solves:** "Where is my [metric]?" navigation problem

### Section Jump Navigation

**Sections view:**
- Floating TOC pills on right side (desktop/tablet)
- Auto-highlights current section on scroll
- Auto-hides after 3s of inactivity

**Map view:**
- Layer jump chips at top: Activities | Acquisition | Revenue | Outcomes
- Click to smooth-scroll to that layer
- Mobile: Tap to expand accordion + scroll

### Contextual Help

**Without clutter:**
- Info icons (ⓘ) for metric definitions on hover/tap
- "How is this calculated?" expandable sections
- Threshold explanations in tooltips (why red/amber/green)
- First-time hints (dismissible):
  - "Click any metric to see what drives it"
  - "Use CMD+K to search for any metric"
  - Auto-dismiss after 5s or first interaction

---

## Responsive Design Strategy

### Desktop/Tablet (≥768px)

- Full vertical diagram visible
- Multi-column grid within each layer (2-4 columns depending on screen width)
- Can see 2-3 layers at once
- Smooth scrolling between layers
- Hover interactions work naturally

### Mobile (<768px)

**Collapsible accordion approach:**

Each layer becomes an accordion section:
- **Collapsed**: Layer header with icon, name, metric count badge, chevron
- **Expanded**: Single-column stack of metric cards with connections

**Focus mode on mobile:**
- Works within expanded sections
- Relationship panel slides up as bottom sheet
- Touch interactions instead of hover
- Tap to focus, tap again to unfocus

**Navigation:**
- Sticky two-row header (compressed controls)
- Tap layer header to expand/collapse
- Search (CMD+K) still works with mobile keyboard
- Smooth scroll to focused metric

---

## Technical Implementation

### New Components

**Create in `app/components/metrics-map-v2/`:**

1. **`VerticalMetricsMap.tsx`**
   - Main container managing layout and focus state
   - Handles click/keyboard events
   - Coordinates with RelationshipPanel

2. **`MetricCardV2.tsx`**
   - Enhanced card with sparkline, status, change indicator
   - Props: label, value, status, sparklineData, changePercent, connections, layerGradient
   - Emits click events to parent

3. **`ConnectionLine.tsx`**
   - SVG Bezier curves between card positions
   - Flow animations
   - Shows/hides based on focus state

4. **`RelationshipPanel.tsx`**
   - Slide-in panel (desktop) or bottom sheet (mobile)
   - Shows inputs, outputs, formula, definition
   - Close button and ESC handling

5. **`LayerHeader.tsx`**
   - Visual separator (desktop)
   - Accordion trigger (mobile)
   - Icon + gradient + description

6. **`MetricSearch.tsx`**
   - Command palette modal
   - Fuzzy search across metrics
   - Click result to focus metric

### New Utilities

**Create in `app/utils/`:**

1. **`metricsGraph.ts`**
   - Define relationships: `metricId → { inputs: string[], outputs: string[] }`
   - Functions to get 1st and 2nd degree connections
   - Breadth-first search for relationship chains

2. **`metricPositions.ts`**
   - Calculate card positions in vertical layout
   - Calculate Bezier paths for connection lines
   - Re-calculate on window resize

3. **`focusMode.ts`**
   - Logic for determining dim levels
   - Animation orchestration
   - State management helpers

### State Management

**Focus state structure:**
```typescript
interface FocusState {
  selectedMetricId: string | null;
  focusedMetrics: {
    primary: string[];      // 1st degree
    secondary: string[];    // 2nd degree
  };
  isPanelOpen: boolean;
}
```

**Connection graph:**
```typescript
const metricsRelationships: Record<string, {
  inputs: string[];
  outputs: string[];
}> = {
  'cac-blended': {
    inputs: ['total-sales-marketing', 'new-customers-added'],
    outputs: ['ltv-cac-ratio', 'cac-payback-period']
  },
  // ... etc
};
```

### Animation Library

**Use Framer Motion:**
- `<motion.div>` for declarative animations
- AnimatePresence for enter/exit
- Layout animations for position changes
- Spring physics for natural feel

**Installation:**
```bash
npm install framer-motion
```

### Tailwind Configuration

**Add to `tailwind.config.js`:**
```javascript
theme: {
  extend: {
    colors: {
      'layer-activities-from': '#1e40af',
      'layer-activities-to': '#3b82f6',
      'layer-acquisition-from': '#0d9488',
      'layer-acquisition-to': '#06b6d4',
      'layer-revenue-from': '#059669',
      'layer-revenue-to': '#10b981',
      'layer-outcomes-from': '#7c3aed',
      'layer-outcomes-to': '#6366f1',
    },
    animation: {
      'flow': 'flow 3s linear infinite',
      'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    keyframes: {
      flow: {
        '0%': { strokeDashoffset: '0' },
        '100%': { strokeDashoffset: '-20' },
      },
    },
  },
}
```

---

## Accessibility Requirements

### Keyboard Navigation

- **TAB**: Navigate between metric cards
- **ENTER/SPACE**: Activate focus mode on selected card
- **ESC**: Exit focus mode
- **Arrow keys**: Navigate between connected metrics when in focus mode
- **CMD/CTRL+K**: Open search modal

### Screen Reader Support

- All metric cards have proper ARIA labels and roles
- Focus mode state changes announced
- Relationship panel content accessible
- Connection relationships described in ARIA

### Visual Accessibility

- Color is not the only indicator (use icons/patterns too)
- WCAG AA contrast minimum for all text
- `prefers-reduced-motion` disables animations
- Status indicators use multiple cues (color + border + icon)

---

## Migration Strategy

### Phase 1: Build New Components (Weeks 1-2)
- Create component structure in `metrics-map-v2/`
- Build metrics relationship graph
- Implement basic vertical layout (no interactions yet)

### Phase 2: Focus Mode Interactions (Week 3)
- Add click-to-focus functionality
- Implement dim/desaturate animations
- Build connection line system with flow animations

### Phase 3: Relationship Panel & Search (Week 4)
- Create slide-in relationship panel
- Implement CMD+K search modal
- Wire up formula/definition displays

### Phase 4: Responsive & Mobile (Week 5)
- Accordion implementation for mobile
- Bottom sheet for relationship panel
- Touch interaction testing

### Phase 5: Polish & Accessibility (Week 6)
- Micro-animations and sparklines
- Keyboard navigation
- Screen reader testing
- Reduced motion support

### Phase 6: Testing (Week 7)
- Visual regression tests
- Cypress interaction tests
- Performance profiling (60fps target)
- Cross-browser/device testing

### Phase 7: Soft Launch (Week 8)
- Add feature toggle in Calculator.tsx
- Deploy with opt-in (users can try new design)
- Gather feedback and metrics

### Phase 8: Full Rollout (Week 9)
- Make new design default
- Remove old MetricsMap component
- Clean up feature flag code

---

## Testing Strategy

### Visual Regression
- Screenshot tests for each layer at 3 viewport sizes
- Compare before/after for existing metrics values

### Interaction Testing (Cypress)
```javascript
// Example test scenarios
- Click metric → enters focus mode with correct opacity levels
- Click again → exits focus mode
- ESC key exits focus mode
- CMD+K opens search modal
- Type in search → filters results
- Click search result → scrolls and focuses metric
- Mobile accordion expands/collapses
- Relationship panel slides in/out
```

### Performance Testing
- 60fps during animations (Chrome DevTools performance profile)
- Time to Interactive < 3s
- Lighthouse score ≥ 90

### Accessibility Audit
- Run axe-core automated tests
- Manual screen reader testing (VoiceOver, NVDA)
- Keyboard-only navigation testing
- Color contrast verification

---

## Success Metrics

### Qualitative
- Users can articulate what drives key metrics (e.g., "I understand what affects my CAC now")
- Reduced support questions about metric relationships
- Positive feedback on visual design and professionalism

### Quantitative
- Increased engagement with Metrics Map view (time spent, clicks)
- Search feature adoption rate
- Focus mode interaction rate (% of users who click metrics)
- Mobile usage doesn't drop after redesign
- Performance: 60fps maintained, load time < 3s

---

## Open Questions / Future Enhancements

### Not in MVP but worth considering later:

1. **Scenario comparison**: Side-by-side view comparing two input scenarios
2. **Historical playback**: Slider to see how metrics evolved over time
3. **Export**: Download metrics map as PNG/PDF for presentations
4. **Annotations**: Users can add notes to specific metrics
5. **Alerts**: Set thresholds and get notified when metrics cross them
6. **3rd degree connections**: Option to expand beyond 2 degrees
7. **Custom metrics**: Allow users to define their own calculated metrics

---

## Design Artifacts

### Figma/Design Files
*(To be created during implementation - link here)*

### Example Relationship Graph
```
S&M Spend
  ↓
Marketing Spend (by channel)
  ↓
Impressions → Clicks → Leads → MQLs → SQLs → Opps → Wins
  ↓                                               ↓
CPM, CPC, CTR                              New Bookings
  ↓                                               ↓
Cost/Lead, Cost/MQL, Cost/SQL              + Expansion ARR
  ↓                                         - Churned ARR
CAC (Blended) ← New Customers Added              ↓
  ↓                                         Net New ARR
LTV:CAC Ratio ← LTV ← ARPA × Lifetime           ↓
  ↓                                         Ending ARR
Payback Period                                   ↓
  ↓                                         ARR Growth Rate
Rule of 40 ← Growth Rate + EBITDA Margin        ↓
                                            Rule of 40
```

---

## Conclusion

This redesign transforms the Metrics Map from a static horizontal flow into an interactive, vertical waterfall that makes metric relationships intuitive and explorable. The click-to-focus interaction with two degrees of separation strikes the right balance between context and clarity. Professional animations and responsive design ensure the experience works everywhere while maintaining visual sophistication.

**Next Step**: Begin Phase 1 implementation - create component structure and build metrics relationship graph.
