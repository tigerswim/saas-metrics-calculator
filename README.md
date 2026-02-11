# SaaS Metrics Calculator

An executive intelligence tool for B2B SaaS metrics modeling. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌐 Deployments

This repository maintains **two separate production deployments**:

- **Generic SaaS Calculator** (main branch): https://saas-metrics-calculator.netlify.app
- **Earnix Branded** (earnix-branded branch): https://earnix-metrics-calculator.netlify.app

**📖 Important**: See [BRANCH-STRATEGY.md](./BRANCH-STRATEGY.md) for details on branch differences and development workflow.

## Features

- **Executive Brief**: Auto-generated narrative summary with key insights
- **Decision-Oriented Layout**: Sections organized around what C-suite needs to act on
- **Real-time Calculations**: All 50+ metrics update instantly as inputs change
- **Pipeline Funnel**: Visual funnel showing MQL → SQL → Opportunity → Deal progression
- **Investment Signals**: Clear guidance on where to increase, maintain, or reduce spend
- **Inline Benchmarks**: Industry targets shown alongside current values

## Dashboard Sections

1. **Executive Brief** - Narrative summary, key metrics, and primary insight
2. **What Needs Attention** - Metrics below benchmark, ranked by severity
3. **Where to Invest** - Budget allocation signals based on efficiency metrics
4. **Pipeline Funnel** - Conversion rates and pipeline velocity
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
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

## Deployment

Configured for static export on Netlify.

- Build command: `npm run build`
- Publish directory: `out`

## Key Metrics

- **ARR & Growth**: Net New ARR, Growth Rate, MRR
- **Retention**: GRR, NRR, Logo Churn (monthly and annualized)
- **Unit Economics**: LTV, CAC, LTV:CAC Ratio, CAC Payback
- **Pipeline**: Conversion rates, Pipeline Velocity, Win Rate
- **Efficiency**: Magic Number, Quick Ratio, Burn Multiple
- **Financial**: Gross Margin, EBITDA Margin, Rule of 40

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Export**: Static site generation

## Design Principles

- Typography-driven hierarchy (no decorative cards)
- Tabular data with inline benchmarks
- Color used for signal, not decoration
- Decision-oriented sections over metric categories

## License

MIT
