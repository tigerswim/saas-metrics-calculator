'use client';

import { CalculatedMetrics, Inputs } from '../types';
import MetricCard from './MetricCard';
import MetricConnection from './MetricConnection';
import {
  getMetricStatus,
  formatMetricValue,
} from '../utils/metricsMapUtils';
import {
  generateAllTimeSeriesData,
  calculateWoWChange,
} from '../utils/timeSeriesData';

interface MetricsMapProps {
  metrics: CalculatedMetrics;
  inputs: Inputs;
}

export default function MetricsMap({ metrics, inputs }: MetricsMapProps) {
  // Generate time series data for all metrics
  const timeSeriesData = generateAllTimeSeriesData(metrics, inputs);
  
  // Calculate derived values
  const totalMarketingSpend = inputs.paidSearchSpend + inputs.paidSocialSpend + 
    inputs.eventsSpend + inputs.contentSpend + inputs.partnershipsSpend;
  const paidMarketingSpend = inputs.paidSearchSpend + inputs.paidSocialSpend;
  const clickToLeadRate = inputs.paidClicks > 0 
    ? (inputs.leadsGenerated / inputs.paidClicks) * 100 
    : 0;
  const leadToMqlRate = inputs.leadsGenerated > 0 
    ? (inputs.mqlsGenerated / inputs.leadsGenerated) * 100 
    : 0;
  const costPerLead = inputs.leadsGenerated > 0 ? (totalMarketingSpend * 1000) / inputs.leadsGenerated : 0;
  const costPerMQL = inputs.mqlsGenerated > 0 ? (totalMarketingSpend * 1000) / inputs.mqlsGenerated : 0;
  const costPerSQL = metrics.sqlsGenerated > 0 ? (totalMarketingSpend * 1000) / metrics.sqlsGenerated : 0;
  const costPerOpp = metrics.opportunitiesCreated > 0 ? (totalMarketingSpend * 1000) / metrics.opportunitiesCreated : 0;
  const costPerWon = metrics.dealsClosedWon > 0 ? (totalMarketingSpend * 1000) / metrics.dealsClosedWon : 0;

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">
          Metrics Map
        </h2>
        <p className="text-sm text-slate-600">
          Visual flow showing how metrics connect and influence each other
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 overflow-x-auto">
        {/* Acquisition Flow Section */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Acquisition Flow
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            {/* Marketing Spend */}
            <MetricCard
              id="marketing-spend"
              label="S&M Spend"
              value={`$${(inputs.totalSalesMarketing * 1000).toLocaleString()}`}
              status="good"
            />

            <MetricConnection
              fromId="marketing-spend"
              toId="impressions"
              label={`$${(totalMarketingSpend * 1000).toLocaleString()}`}
            />

            {/* Impressions */}
            <MetricCard
              id="impressions"
              label="Impressions"
              value={inputs.paidImpressions.toLocaleString()}
              status="good"
            />

            <MetricConnection
              fromId="impressions"
              toId="clicks"
              label={`${metrics.ctr.toFixed(2)}% CTR`}
            />

            {/* Clicks */}
            <MetricCard
              id="clicks"
              label="Clicks"
              value={inputs.paidClicks.toLocaleString()}
              status={getMetricStatus('ctr', metrics.ctr, metrics, inputs)}
              timeSeriesData={timeSeriesData.paidClicks}
              changePercent={calculateWoWChange(timeSeriesData.paidClicks)}
              showSparkline={true}
            />

            <MetricConnection
              fromId="clicks"
              toId="leads"
              label={`${clickToLeadRate.toFixed(1)}%`}
            />

            {/* Leads */}
            <MetricCard
              id="leads"
              label="Leads"
              value={inputs.leadsGenerated.toLocaleString()}
              status="good"
              timeSeriesData={timeSeriesData.leadsGenerated}
              changePercent={calculateWoWChange(timeSeriesData.leadsGenerated)}
              showSparkline={true}
            />

            <MetricConnection
              fromId="leads"
              toId="mqls"
              label={`${leadToMqlRate.toFixed(1)}%`}
            />

            {/* MQLs */}
            <MetricCard
              id="mqls"
              label="MQLs"
              value={inputs.mqlsGenerated.toLocaleString()}
              status="good"
              timeSeriesData={timeSeriesData.mqlsGenerated}
              changePercent={calculateWoWChange(timeSeriesData.mqlsGenerated)}
              showSparkline={true}
            />

            <MetricConnection
              fromId="mqls"
              toId="sqls"
              label={`${inputs.mqlToSQLConversion}%`}
            />

            {/* SQLs */}
            <MetricCard
              id="sqls"
              label="SQLs"
              value={metrics.sqlsGenerated.toLocaleString()}
              status="good"
            />

            <MetricConnection
              fromId="sqls"
              toId="opps"
              label={`${inputs.sqlToOppConversion}%`}
            />

            {/* Opportunities */}
            <MetricCard
              id="opps"
              label="Opportunities"
              value={metrics.opportunitiesCreated.toLocaleString()}
              status="good"
            />

            <MetricConnection
              fromId="opps"
              toId="won"
              label={`${inputs.winRate}%`}
            />

            {/* Deals Won */}
            <MetricCard
              id="won"
              label="Deals Won"
              value={metrics.dealsClosedWon.toLocaleString()}
              status="good"
              timeSeriesData={timeSeriesData.dealsClosedWon}
              changePercent={calculateWoWChange(timeSeriesData.dealsClosedWon)}
              showSparkline={true}
            />
          </div>

          {/* Cost metrics row below acquisition flow */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
              <div className="text-center">
                <div className="text-slate-500 mb-1">Cost/Lead</div>
                <div className="font-medium text-slate-900">${costPerLead.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 mb-1">Cost/MQL</div>
                <div className="font-medium text-slate-900">${costPerMQL.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 mb-1">Cost/SQL</div>
                <div className="font-medium text-slate-900">${costPerSQL.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 mb-1">Cost/Opp</div>
                <div className="font-medium text-slate-900">${costPerOpp.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 mb-1">Cost/Won</div>
                <div className="font-medium text-slate-900">${costPerWon.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Flow Section */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Revenue Flow
          </h3>

          <div className="space-y-6">
            {/* Top row: New Bookings, Expansion, Churn */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
              <MetricCard
                id="new-bookings"
                label="New Bookings"
                value={formatMetricValue('newBookings', metrics.newBookings, metrics, inputs)}
                status="good"
                timeSeriesData={timeSeriesData.newBookings}
                changePercent={calculateWoWChange(timeSeriesData.newBookings)}
                showSparkline={true}
              />

              <MetricCard
                id="expansion"
                label="Expansion ARR"
                value={formatMetricValue('expansionARR', inputs.expansionARR, metrics, inputs)}
                status={getMetricStatus('annualizedNRR', metrics.annualizedNRR, metrics, inputs)}
                timeSeriesData={timeSeriesData.expansionARR}
                changePercent={calculateWoWChange(timeSeriesData.expansionARR)}
                showSparkline={true}
              />

              <MetricCard
                id="churn"
                label="Churned ARR"
                value={formatMetricValue('churnedARR', inputs.churnedARR, metrics, inputs)}
                status={getMetricStatus('annualizedGRR', metrics.annualizedGRR, metrics, inputs)}
                timeSeriesData={timeSeriesData.churnedARR}
                changePercent={calculateWoWChange(timeSeriesData.churnedARR)}
                showSparkline={true}
              />
            </div>

            {/* Arrows pointing down to Net New ARR */}
            <div className="flex justify-center">
              <div className="flex items-center gap-4">
                <div className="text-xs text-slate-500 text-center">
                  <div>New + Expansion</div>
                  <div className="text-rose-600">- Churn</div>
                </div>
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Net New ARR */}
            <div className="flex justify-center">
              <MetricCard
                id="net-new-arr"
                label="Net New ARR"
                value={formatMetricValue('netNewARR', metrics.netNewARR, metrics, inputs)}
                status={metrics.netNewARR >= 0 ? 'good' : 'bad'}
                className="min-w-[180px]"
                timeSeriesData={timeSeriesData.netNewARR}
                changePercent={calculateWoWChange(timeSeriesData.netNewARR)}
                showSparkline={true}
              />
            </div>

            {/* Arrow pointing down to Ending ARR */}
            <div className="flex justify-center">
              <div className="flex items-center gap-4">
                <div className="text-xs text-slate-500 text-center">
                  Beginning ARR + Net New
                </div>
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Ending ARR */}
            <div className="flex justify-center">
              <MetricCard
                id="ending-arr"
                label="Ending ARR"
                value={formatMetricValue('endingARR', metrics.endingARR * 1000, metrics, inputs)}
                status={getMetricStatus('annualizedGrowthRate', metrics.annualizedGrowthRate, metrics, inputs)}
                className="min-w-[180px]"
                timeSeriesData={timeSeriesData.endingARR}
                changePercent={calculateWoWChange(timeSeriesData.endingARR)}
                showSparkline={true}
              />
            </div>
          </div>

          {/* Retention metrics row */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">GRR (Annual)</div>
                <div className={`text-lg font-semibold ${
                  metrics.annualizedGRR >= 90 ? 'text-emerald-600' :
                  metrics.annualizedGRR >= 80 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {metrics.annualizedGRR.toFixed(0)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">NRR (Annual)</div>
                <div className={`text-lg font-semibold ${
                  metrics.annualizedNRR >= 110 ? 'text-emerald-600' :
                  metrics.annualizedNRR >= 100 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {metrics.annualizedNRR.toFixed(0)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">Logo Churn</div>
                <div className={`text-lg font-semibold ${
                  metrics.logoChurnRate <= 1.5 ? 'text-emerald-600' :
                  metrics.logoChurnRate <= 3 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {metrics.logoChurnRate.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">Ending Customers</div>
                <div className="text-lg font-semibold text-slate-900">
                  {metrics.endingCustomerCount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Economics & Financial Metrics Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Unit Economics & Financial Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Unit Economics */}
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Unit Economics
              </div>
              <MetricCard
                id="cac"
                label="CAC (Blended)"
                value={formatMetricValue('cacBlended', metrics.cacBlended, metrics, inputs)}
                status={getMetricStatus('ltvCacRatio', metrics.ltvCacRatio, metrics, inputs)}
              />
              <MetricCard
                id="ltv"
                label="LTV"
                value={formatMetricValue('ltv', metrics.ltv, metrics, inputs)}
                status="good"
              />
              <MetricCard
                id="ltv-cac"
                label="LTV:CAC"
                value={formatMetricValue('ltvCacRatio', metrics.ltvCacRatio, metrics, inputs)}
                status={getMetricStatus('ltvCacRatio', metrics.ltvCacRatio, metrics, inputs)}
                timeSeriesData={timeSeriesData.ltvCacRatio}
                changePercent={calculateWoWChange(timeSeriesData.ltvCacRatio)}
                showSparkline={true}
              />
              <MetricCard
                id="cac-payback"
                label="CAC Payback"
                value={formatMetricValue('cacPaybackPeriod', metrics.cacPaybackPeriod, metrics, inputs)}
                status={getMetricStatus('cacPaybackPeriod', metrics.cacPaybackPeriod, metrics, inputs)}
              />
            </div>

            {/* Sales Efficiency */}
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Sales Efficiency
              </div>
              <MetricCard
                id="magic-number"
                label="Magic Number"
                value={formatMetricValue('magicNumber', metrics.magicNumber, metrics, inputs)}
                status={getMetricStatus('magicNumber', metrics.magicNumber, metrics, inputs)}
                timeSeriesData={timeSeriesData.magicNumber}
                changePercent={calculateWoWChange(timeSeriesData.magicNumber)}
                showSparkline={true}
              />
              <MetricCard
                id="quick-ratio"
                label="Quick Ratio"
                value={formatMetricValue('saasQuickRatio', metrics.saasQuickRatio, metrics, inputs)}
                status={getMetricStatus('saasQuickRatio', metrics.saasQuickRatio, metrics, inputs)}
                timeSeriesData={timeSeriesData.saasQuickRatio}
                changePercent={calculateWoWChange(timeSeriesData.saasQuickRatio)}
                showSparkline={true}
              />
            </div>

            {/* Financial Performance */}
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Financial Performance
              </div>
              <MetricCard
                id="gross-margin"
                label="Gross Margin"
                value={formatMetricValue('grossMargin', metrics.grossMargin, metrics, inputs)}
                status={getMetricStatus('grossMargin', metrics.grossMargin, metrics, inputs)}
              />
              <MetricCard
                id="ebitda"
                label="EBITDA"
                value={formatMetricValue('ebitda', metrics.ebitda, metrics, inputs)}
                status={metrics.ebitda >= 0 ? 'good' : 'bad'}
              />
              <MetricCard
                id="ebitda-margin"
                label="EBITDA Margin"
                value={formatMetricValue('ebitdaMargin', metrics.ebitdaMargin, metrics, inputs)}
                status={metrics.ebitdaMargin >= 0 ? 'good' : 'warning'}
              />
            </div>

            {/* Key KPIs */}
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Key KPIs
              </div>
              <MetricCard
                id="rule-of-40"
                label="Rule of 40"
                value={formatMetricValue('ruleOf40', metrics.ruleOf40, metrics, inputs)}
                status={getMetricStatus('ruleOf40', metrics.ruleOf40, metrics, inputs)}
                className="min-w-[160px]"
                timeSeriesData={timeSeriesData.ruleOf40}
                changePercent={calculateWoWChange(timeSeriesData.ruleOf40)}
                showSparkline={true}
              />
              <MetricCard
                id="arr-growth"
                label="ARR Growth"
                value={formatMetricValue('annualizedGrowthRate', metrics.annualizedGrowthRate, metrics, inputs)}
                status={getMetricStatus('annualizedGrowthRate', metrics.annualizedGrowthRate, metrics, inputs)}
                timeSeriesData={timeSeriesData.endingARR.map(v => (v / (inputs.beginningARR * 1000) - 1) * 100)}
                changePercent={calculateWoWChange(timeSeriesData.endingARR.map(v => (v / (inputs.beginningARR * 1000) - 1) * 100))}
                showSparkline={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

