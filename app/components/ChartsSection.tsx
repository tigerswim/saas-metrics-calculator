'use client';

import { Inputs, CalculatedMetrics } from '../types';
import GrowthMetricsDashboard from './charts/GrowthMetricsDashboard';
import ChurnComparison from './charts/ChurnComparison';
import RuleOf40Gauge from './charts/RuleOf40Gauge';

interface ChartsSectionProps {
  inputs: Inputs;
  metrics: CalculatedMetrics;
}

export default function ChartsSection({ inputs, metrics }: ChartsSectionProps) {
  // Calculate revenue churn rate (churned ARR / beginning ARR)
  const revenueChurnRate = (inputs.churnedARR / (inputs.beginningARR * 1000)) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-1 w-12 bg-gradient-arr rounded"></div>
        <h2 className="text-2xl font-bold text-slate-900">Data Visualization</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GrowthMetricsDashboard
          netNewARR={metrics.netNewARR}
          growthRate={metrics.arrGrowthRateMonthly}
          beginningARR={inputs.beginningARR}
          endingARR={metrics.endingARR}
          newBookings={inputs.newBookings}
          expansion={inputs.expansionARR}
          churn={inputs.churnedARR}
        />

        <ChurnComparison
          logoChurnRate={metrics.logoChurnRate}
          revenueChurnRate={revenueChurnRate}
          customersChurned={inputs.customersChurned}
          totalCustomers={inputs.totalCustomers}
          churnedARR={inputs.churnedARR}
          beginningARR={inputs.beginningARR}
        />

        <RuleOf40Gauge
          growthRate={metrics.annualizedGrowthRate} // Already in percentage form from calculator
          ebitdaMargin={metrics.ebitdaMargin}
          ruleOf40={metrics.ruleOf40}
        />
      </div>
    </div>
  );
}
