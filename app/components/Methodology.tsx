'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface BenchmarkSource {
  metric: string;
  target: string;
  sources: string[];
  notes?: string;
}

const benchmarkSources: BenchmarkSource[] = [
  {
    metric: 'LTV:CAC Ratio',
    target: '>3.0x',
    sources: ['Bessemer Venture Partners', 'OpenView Partners', 'SaaS Capital'],
    notes: 'Industry standard for sustainable unit economics. Below 3x indicates acquisition costs may not be recoverable.'
  },
  {
    metric: 'CAC Payback Period',
    target: '<18 months',
    sources: ['KeyBanc SaaS Survey', 'Bessemer Cloud Index'],
    notes: 'Measures capital efficiency. Top quartile SaaS companies achieve <12 months.'
  },
  {
    metric: 'Gross Revenue Retention (GRR)',
    target: '>90%',
    sources: ['KBCM SaaS Survey 2024', 'Gainsight Benchmarks'],
    notes: 'Measures baseline customer retention excluding expansion. Enterprise SaaS often exceeds 95%.'
  },
  {
    metric: 'Net Revenue Retention (NRR)',
    target: '>110%',
    sources: ['KeyBanc Capital Markets', 'Bessemer State of the Cloud'],
    notes: 'Includes expansion revenue. Best-in-class SaaS companies exceed 120-130%.'
  },
  {
    metric: 'Rule of 40',
    target: '>40%',
    sources: ['Bain & Company', 'Battery Ventures'],
    notes: 'Growth rate + profit margin. Originally coined by Brad Feld. Indicates balanced growth/profitability.'
  },
  {
    metric: 'Magic Number',
    target: '>0.75x',
    sources: ['Scale Venture Partners', 'Salesforce Ventures'],
    notes: 'Measures S&M efficiency. >1.0x indicates highly efficient growth; <0.5x signals inefficiency.'
  },
  {
    metric: 'Gross Margin',
    target: '>75%',
    sources: ['SaaS Capital', 'Software Equity Group'],
    notes: 'SaaS benchmark. Lower margins may indicate infrastructure inefficiency or services-heavy model.'
  },
  {
    metric: 'Logo Churn Rate',
    target: '<1.5%/month',
    sources: ['ProfitWell', 'ChartMogul SaaS Benchmarks'],
    notes: 'Monthly customer churn. Varies significantly by segment (SMB vs. Enterprise).'
  },
  {
    metric: 'Quick Ratio',
    target: '>4.0x',
    sources: ['Mamoon Hamid (Social Capital)', 'SaaStr'],
    notes: '(New + Expansion) / Churned. Measures growth efficiency relative to losses.'
  },
  {
    metric: 'Burn Multiple',
    target: '<1.5x',
    sources: ['David Sacks', 'Craft Ventures'],
    notes: 'Net burn / Net new ARR. Lower is better; <1x is efficient growth.'
  },
];

export default function Methodology() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mt-8 border-t border-slate-200 pt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Methodology & Sources
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Benchmark targets and industry data sources
          </p>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Overview */}
          <div className="bg-slate-50 border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">About This Calculator</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              This calculator uses industry-standard SaaS metrics and benchmarks derived from
              annual surveys and research by leading venture capital firms and SaaS analysts.
              Benchmarks represent median or target values for growth-stage B2B SaaS companies
              and may vary based on company stage, market segment, and business model.
            </p>
          </div>

          {/* Benchmark Sources Table */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Benchmark Sources</h3>
            <div className="border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wide">
                <div className="col-span-3">Metric</div>
                <div className="col-span-2">Target</div>
                <div className="col-span-3">Sources</div>
                <div className="col-span-4">Notes</div>
              </div>

              {/* Rows */}
              {benchmarkSources.map((item, index) => (
                <div
                  key={item.metric}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 text-sm ${
                    index < benchmarkSources.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="col-span-3 font-medium text-slate-900">{item.metric}</div>
                  <div className="col-span-2 tabular-nums text-slate-700">{item.target}</div>
                  <div className="col-span-3 text-slate-600">
                    {item.sources.map((source, i) => (
                      <span key={source}>
                        {source}
                        {i < item.sources.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                  <div className="col-span-4 text-slate-500 text-xs leading-relaxed">
                    {item.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Notes */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Calculation Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Annualization Method
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monthly retention rates are annualized using compound calculation:
                  Annual Rate = (Monthly Rate)^12. This reflects the compounding effect
                  of retention over a full year.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Currency Handling
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Beginning ARR is entered in millions ($M). All other monetary inputs
                  use thousands ($K). Calculations normalize these for accurate ratios
                  and comparisons.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  CAC Calculation
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Blended CAC uses total S&M spend divided by new customers.
                  This represents fully-loaded acquisition cost including sales
                  team overhead, not just marketing spend.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Time Period
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All inputs represent a single month's activity. Growth rates and
                  retention metrics are shown both monthly and annualized for
                  comparison with industry benchmarks.
                </p>
              </div>
            </div>
          </div>

          {/* Key References */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Key References</h3>
            <div className="text-sm text-slate-600 space-y-2">
              <p>
                <span className="font-medium text-slate-700">KeyBanc Capital Markets</span> —
                Annual SaaS Survey covering 100+ private SaaS companies
              </p>
              <p>
                <span className="font-medium text-slate-700">Bessemer Venture Partners</span> —
                State of the Cloud report and Cloud Index
              </p>
              <p>
                <span className="font-medium text-slate-700">OpenView Partners</span> —
                Product-Led Growth and expansion benchmarks
              </p>
              <p>
                <span className="font-medium text-slate-700">SaaS Capital</span> —
                Private SaaS company valuation data
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-slate-400 border-t border-slate-200 pt-4">
            <p>
              <strong>Disclaimer:</strong> Benchmarks are indicative and based on publicly available
              industry research. Actual targets should be adjusted based on your company's stage,
              market segment, and strategic priorities. This calculator is for educational and
              planning purposes only.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
