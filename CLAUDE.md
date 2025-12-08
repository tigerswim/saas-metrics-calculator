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
   - Passes data down to InputSection and MetricsDisplay components
3. **Calculation Engine**: `app/utils/calculator.ts`
   - Pure functions: `calculateMetrics()` and `getKeyMetrics()`
   - All business logic and formulas are here
   - Takes Inputs, returns CalculatedMetrics
4. **Display Components**:
   - `InputSection.tsx`: Reusable input group with labels
   - `MetricsDisplay.tsx`: Organizes and displays all calculated metrics

### Type System

All types defined in `app/types.ts`:

- **Inputs**: 22 input fields (ARR, customers, marketing spend, etc.)
- **CalculatedMetrics**: 50+ calculated metrics across 6 categories
- **KeyMetric**: For the top 10 metrics with targets and status colors

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
- **Color Coding**: Metrics use green (good), yellow (warning), red (bad) based on thresholds

## Key Metrics System

The calculator displays 10 "Key Metrics" at the top with:
- **Value**: Current calculated value
- **Target**: Industry benchmark (e.g., ">3:1" for LTV:CAC)
- **Status**: Color indicator based on threshold logic
- **Tooltip**: Brief explanation (optional)

Threshold logic is in `getKeyMetrics()` in `app/utils/calculator.ts`.

## Making Changes

### Adding a New Metric

1. Add property to `CalculatedMetrics` interface in `app/types.ts`
2. Add calculation in `calculateMetrics()` in `app/utils/calculator.ts`
3. Display in the appropriate section in `app/components/MetricsDisplay.tsx`

### Adding a New Input Field

1. Add property to `Inputs` interface in `app/types.ts`
2. Add default value to `defaultInputs` in `app/components/Calculator.tsx`
3. Add input field to the appropriate `<InputSection>` in `Calculator.tsx`
4. Use the new input in calculations in `app/utils/calculator.ts`

### Changing Default Values

Edit `defaultInputs` object in `app/components/Calculator.tsx`.

### Modifying Status Thresholds

Update the conditional logic in `getKeyMetrics()` in `app/utils/calculator.ts`.

## Important Patterns

### Number Handling

- **Beginning ARR** is in millions ($M) - multiply by 1000 for calculations
- All other dollar amounts are in thousands ($K)
- Percentages are stored as whole numbers (e.g., 25 = 25%)
- Use `Math.round()` for counts (customers, deals, etc.)
- Use `.toFixed(1)` or `.toFixed(2)` for display formatting

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
│   ├── Calculator.tsx       # Main component with state
│   ├── InputSection.tsx     # Reusable input group
│   └── MetricsDisplay.tsx   # Metrics display logic
├── utils/
│   └── calculator.ts        # Pure calculation functions
├── types.ts                 # All TypeScript interfaces
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Homepage (renders Calculator)
└── globals.css             # Tailwind base styles
```

## Notes

- No backend or API - entirely client-side
- No data persistence - all state is in-memory
- No authentication or user accounts
- Responsive design works on mobile/tablet/desktop
- All calculations update instantly (no debouncing/throttling)
