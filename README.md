# Earnix Business Metrics Calculator

**A customized industry-aware business metrics calculator with Earnix brand identity.**

## Portfolio Project Context

This is a customized version of the SaaS Metrics Calculator, adapted to demonstrate:

1. **Strategic Business Thinking**: Understanding how selling to different customer verticals (Insurance vs Banking) impacts SaaS business dynamics
2. **Technical Architecture**: Configuration-based approach allowing a single codebase to model different customer segments
3. **Design Execution**: Application of Earnix's real brand identity (colors, typography, visual style)
4. **Domain Knowledge**: Deep understanding of SaaS KPIs and how they vary when selling enterprise software to different industries

**Base Project**: [saas-metrics-calculator](../saas-metrics-calculator/)
**Customization**: Customer vertical segmentation showing how Earnix (a SaaS vendor) models metrics differently when selling to Insurance vs Banking customers

## Key Customizations

### 1. Customer Vertical Segmentation
- **Verticals Supported**: Insurance and Banking (customer segments)
- **Approach**: Configuration-based vertical selector showing how Earnix's metrics differ when selling to different industries
- **Implementation**: Single codebase with configuration files defining vertical-specific defaults and benchmarks
- **URL Routing**: `/insurance` and `/banking` paths with localStorage persistence
- **Use Case**: Demonstrates how a SaaS vendor (Earnix) models business differently across customer verticals

### 2. Earnix Brand Identity
- **Primary Color**: Earnix Orange `#F44D2E` (CTAs, primary accents)
- **Secondary Color**: Deep Teal `#0891b2` (Insurance theme accent)
- **Text Colors**: Dark Teal `#03505C` (headlines), Black (body)
- **Typography**: Space Grotesk (Earnix's brand font)
- **Visual Style**: Modern, technology-forward, clean layouts

### 3. Vertical-Specific Business Dynamics
Standard SaaS terminology throughout, but defaults and benchmarks adapt to reflect selling dynamics:

| Metric | Insurance Vertical | Banking Vertical | Rationale |
|--------|-------------------|------------------|-----------|
| **Avg Deal Size** | $850K | $380K | Insurance carriers buy larger enterprise deals |
| **Sales Cycle** | 8.5 months | 6.5 months | Insurance has longer compliance/procurement |
| **Win Rate** | 38% | 32% | Insurance more consultative, higher close rates |
| **Customer Lifetime** | 48 months | 36 months | Insurance customers are stickier |
| **Total Customers** | 85 | 120 | Insurance = fewer logos but higher ACV; Banking = broader market |
| **Events Investment** | $180K | $95K | Insurance heavy on industry conferences |
| **Partnership Leads** | 0 | 180 | Banking benefits from core banking vendor partnerships |

### 4. Vertical-Specific Defaults & Benchmarks
- **Different starting values** reflecting vertical dynamics (e.g., Insurance: $850K ACV, 85 customers; Banking: $380K ACV, 120 customers)
- **Vertical-tuned benchmarks** for performance targets (good/warning/bad ranges)
- **Operational differences** (Insurance: higher R&D for product complexity; Banking: more partnership-driven lead gen)

## Features

- **Customer Vertical Selector**: Header dropdown to switch between Insurance and Banking customer segments
- **Standard SaaS Terminology**: All metrics use universal SaaS language (ARR, customers, leads, etc.)
- **Vertical-Specific Defaults**: Business assumptions adapt to reflect selling dynamics per vertical
- **Real-time Calculations**: 50+ metrics update instantly
- **Visual Differentiation**: Subtle color accents (Phase 2 - planned)
  - Insurance: Deep Teal `#0891b2` badge and accents
  - Banking: Earnix Orange `#F44D2E` badge and accents
- **Persistent Selection**: Vertical choice saved to localStorage
- **Enterprise Focus**: Models selling to large enterprise customers (insurance carriers, banks)

## Dashboard Sections

1. **Executive Brief** - Narrative summary, key metrics, and primary insight
2. **What Needs Attention** - Metrics below benchmark, ranked by severity
3. **Where to Invest** - Budget allocation signals based on efficiency metrics
4. **Pipeline Funnel** - Conversion rates and pipeline velocity (industry-adapted)
5. **Growth Trajectory** - ARR movement, retention, and customer metrics
6. **Unit Economics** - LTV, CAC, payback, and customer value metrics
7. **Financial Position** - P&L summary, efficiency ratios, and OpEx allocation

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
# Opens on http://localhost:3000 (or 3001 if 3000 is in use)
```

Open [http://localhost:3000](http://localhost:3000) in your browser (or http://localhost:3001 if port 3000 is in use).

### Build for Production

```bash
npm run build
```

## Architecture Highlights

### Configuration-Based Design
```typescript
// app/config/industryConfig.ts
interface IndustryConfig {
  id: 'insurance' | 'banking';
  name: string;
  labelMappings: Record<string, string>;
  defaultInputs: Inputs;
  metricTargets: Record<string, MetricTarget>;
  tooltips: Record<string, string>;
}
```

### Context-Driven Rendering
- `IndustryContext` provides current industry to all components
- `useIndustry()` hook for accessing industry config
- Single component set adapts via configuration (DRY principle)

### Scalability
Adding Healthcare or Retail vertical requires:
1. Create config file: `app/config/healthcareConfig.ts`
2. Add to industry selector dropdown
3. No component code changes needed

## Key Metrics

- **ARR & Growth**: Net New ARR, Growth Rate, MRR
- **Retention**: GRR, NRR, Logo Churn (annualized)
- **Unit Economics**: LTV, CAC, LTV:CAC Ratio, CAC Payback
- **Pipeline**: Conversion rates, Pipeline Velocity, Win Rate
- **Efficiency**: Magic Number, Quick Ratio, Burn Multiple
- **Financial**: Gross Margin, EBITDA Margin, Rule of 40

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + hooks
- **Routing**: Next.js routing with URL parameters
- **Storage**: localStorage for persistence

## Design Principles

- **Earnix Brand Consistency**: Faithful application of real company's brand identity
- **Minimal Differentiation**: Subtle color accents respect Earnix's co-equal vertical philosophy
- **Configuration Over Code**: Architecture supports easy industry expansion
- **Semantic Accuracy**: Industry-specific terminology, not just find-and-replace
- **Performance First**: Client-side calculations, instant updates

## Interview Talking Points

When presenting this project:

**Problem**: "Generic SaaS calculators don't model how selling to different customer verticals changes business dynamics. Selling enterprise software to insurance carriers is fundamentally different from selling to banks."

**Solution**: "I built a configurable calculator that models how a SaaS vendor (Earnix) experiences different metrics when selling to Insurance vs Banking customers. Same product, different customer dynamics."

**Technical Approach**: "Configuration-based architecture using React Context allows a single codebase to model different customer segments. Adding a new vertical (e.g., Healthcare) requires only a config file defining that vertical's buying behavior."

**Business Insight**: "Insurance customers buy bigger deals ($850K vs $380K), have longer sales cycles (8.5mo vs 6.5mo), but are stickier (48mo lifetime vs 36mo). Banking customers come from partnerships, Insurance from conferences. This affects everything from marketing spend allocation to retention targets."

**Design Decisions**: "I applied Earnix's actual brand identity (orange, teal, Space Grotesk) to show I can work within real-world brand constraints while building sophisticated functionality."

## Comparison with Base Version

| Aspect | Base (SaaS Calculator) | Earnix Version |
|--------|----------------------|----------------|
| **Industries** | Generic SaaS | Insurance + Banking |
| **Branding** | Generic blue/gray | Earnix orange/teal |
| **Labels** | Static SaaS terms | Dynamic industry-aware |
| **Defaults** | Single set | Industry-specific |
| **Thresholds** | Universal | Industry-adapted |
| **Typography** | System font | Space Grotesk (brand font) |
| **Architecture** | Single-context | Multi-industry config |

## License

MIT

---

**Portfolio Piece** | **Demonstrates**: Strategic Thinking + Technical Execution + Design Sensibility
