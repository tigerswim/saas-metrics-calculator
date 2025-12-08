# SaaS Metrics Calculator

An interactive web application for modeling SaaS business metrics. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time calculations**: All metrics update instantly as you change input values
- **Key metrics summary**: Quick view of critical KPIs with target benchmarks
- **Color-coded indicators**: Visual feedback on metric performance (good/warning/bad)
- **Comprehensive metrics**: Track ARR growth, retention, pipeline, CAC, LTV, and more
- **Responsive design**: Works seamlessly on desktop and mobile devices

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
npm start
```

## Deployment

This application is optimized for deployment on Netlify, Vercel, or any platform that supports Next.js.

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

### Vercel

```bash
vercel deploy
```

## Key Metrics Tracked

- **ARR Growth %**: Annual recurring revenue growth rate
- **GRR/NRR**: Gross and Net Revenue Retention
- **LTV:CAC Ratio**: Customer lifetime value to acquisition cost
- **CAC Payback**: Time to recover customer acquisition costs
- **Rule of 40**: Growth rate + EBITDA margin
- **Magic Number**: Sales efficiency metric
- **Logo Churn**: Customer churn rate
- **Gross Margin**: Revenue minus COGS
- **SaaS Quick Ratio**: Growth momentum indicator

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Netlify/Vercel ready

## Usage

1. Adjust the input values in the left panel
2. Watch metrics update in real-time on the right panel
3. Check the Key Metrics Summary at the top for quick insights
4. Use the "Reset to Defaults" button to restore sample values

## License

MIT# saas-metrics-calculator
