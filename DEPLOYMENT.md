# SaaS Metrics Calculator - Deployment Instructions

## Quick Start (Local Development)

1. Navigate to the project directory:
   ```bash
   cd saas-metrics-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser (or http://localhost:3001 if port 3000 is in use)

## Project Structure

```
saas-metrics-calculator/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Calculator.tsx       # Main calculator component
â”‚   â”‚   â”œâ”€â”€ InputSection.tsx     # Reusable input section component
â”‚   â”‚   â””â”€â”€ MetricsDisplay.tsx   # Calculated metrics display
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â””â”€â”€ calculator.ts        # All calculation logic
â”‚   â”œâ”€â”€ types.ts                 # TypeScript type definitions
â”‚   â”œâ”€â”€ layout.tsx               # Root layout
â”‚   â”œâ”€â”€ page.tsx                 # Homepage
â”‚   â””â”€â”€ globals.css              # Global styles with Tailwind
â”œâ”€â”€ public/                      # Static assets
â”œâ”€â”€ package.json
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ tailwind.config.js
â”œâ”€â”€ next.config.js
â”œâ”€â”€ netlify.toml                 # Netlify deployment config
â””â”€â”€ README.md
```

## Deploy to Netlify (Recommended)

### Option 1: GitHub + Netlify Dashboard

1. Push your code to GitHub:
   ```bash
   cd saas-metrics-calculator
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to https://app.netlify.com
3. Click "Add new site" â†’ "Import an existing project"
4. Connect to GitHub and select your repository
5. Netlify will auto-detect Next.js and use the settings from netlify.toml
6. Click "Deploy site"

### Option 2: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy:
   ```bash
   cd saas-metrics-calculator
   netlify init
   netlify deploy --prod
   ```

## Deploy to Vercel (Alternative)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd saas-metrics-calculator
   vercel
   ```

3. Follow the prompts to complete deployment

## Features Included

âœ… Real-time metric calculations
âœ… 10 key metrics with target benchmarks
âœ… Color-coded status indicators (green/yellow/red)
âœ… 6 input sections with 22 configurable parameters
âœ… 50+ calculated metrics across 6 categories:
   - ARR & Growth Metrics
   - Retention Metrics
   - Pipeline Metrics
   - Marketing Efficiency
   - Sales Efficiency
   - Financial Performance
âœ… Responsive design (mobile-friendly)
âœ… Reset to defaults functionality
âœ… Tooltips for metric definitions
âœ… TypeScript for type safety
âœ… Tailwind CSS for modern styling

## Customization Tips

### Change Default Values
Edit `defaultInputs` in `app/components/Calculator.tsx`

### Modify Color Thresholds
Update the status logic in `app/utils/calculator.ts` (getKeyMetrics function)

### Add New Metrics
1. Add field to `CalculatedMetrics` interface in `app/types.ts`
2. Add calculation in `calculateMetrics()` in `app/utils/calculator.ts`
3. Display in `app/components/MetricsDisplay.tsx`

### Style Changes
- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.js`
- Component styles: inline Tailwind classes in TSX files

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first styling
- **React Hooks**: State management with useState

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Instant calculations (client-side)
- No API calls required
- Lightweight bundle size
- Optimized for Core Web Vitals

## Troubleshooting

### Build Errors

If you get module not found errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

Make sure TypeScript version is ^5:
```bash
npm install -D typescript@latest
```

### Styling Issues

Rebuild Tailwind:
```bash
npm run dev
```

## Next Steps

1. **Add Data Persistence**: Integrate with Supabase to save scenarios
2. **Add Charts**: Use Chart.js or Recharts for visualizations
3. **Add Export**: Generate PDF reports with jsPDF
4. **Add Comparison**: Side-by-side scenario comparison
5. **Add Historical Tracking**: Track metrics over time
6. **Add Team Sharing**: Share scenarios with team members

## Support

For issues or questions:
- Check the README.md
- Review Next.js documentation: https://nextjs.org/docs
- Review Tailwind docs: https://tailwindcss.com/docs

Happy calculating! ðŸš€