'use client';

import { Inputs, CalculatedMetrics } from '../types';

interface ChannelMixProps {
  inputs: Inputs;
  metrics: CalculatedMetrics;
}

interface ChannelData {
  name: string;
  spend: number;
  leads: number;
  cpl: number;
  pctSpend: number;
  pctLeads: number;
  efficiency: 'high' | 'medium' | 'low';
}

export default function ChannelMix({ inputs, metrics }: ChannelMixProps) {
  // Calculate totals
  const totalSpend = inputs.paidSearchSpend + inputs.paidSocialSpend + inputs.eventsSpend + inputs.contentSpend + inputs.partnershipsSpend;
  const totalLeads = inputs.paidSearchLeads + inputs.paidSocialLeads + inputs.eventsLeads + inputs.contentLeads + inputs.partnershipsLeads;

  // Build channel data
  const channels: ChannelData[] = [
    {
      name: 'Paid Search',
      spend: inputs.paidSearchSpend,
      leads: inputs.paidSearchLeads,
      cpl: inputs.paidSearchLeads > 0 ? (inputs.paidSearchSpend * 1000) / inputs.paidSearchLeads : 0,
      pctSpend: totalSpend > 0 ? (inputs.paidSearchSpend / totalSpend) * 100 : 0,
      pctLeads: totalLeads > 0 ? (inputs.paidSearchLeads / totalLeads) * 100 : 0,
      efficiency: 'medium',
    },
    {
      name: 'Paid Social',
      spend: inputs.paidSocialSpend,
      leads: inputs.paidSocialLeads,
      cpl: inputs.paidSocialLeads > 0 ? (inputs.paidSocialSpend * 1000) / inputs.paidSocialLeads : 0,
      pctSpend: totalSpend > 0 ? (inputs.paidSocialSpend / totalSpend) * 100 : 0,
      pctLeads: totalLeads > 0 ? (inputs.paidSocialLeads / totalLeads) * 100 : 0,
      efficiency: 'medium',
    },
    {
      name: 'Events',
      spend: inputs.eventsSpend,
      leads: inputs.eventsLeads,
      cpl: inputs.eventsLeads > 0 ? (inputs.eventsSpend * 1000) / inputs.eventsLeads : 0,
      pctSpend: totalSpend > 0 ? (inputs.eventsSpend / totalSpend) * 100 : 0,
      pctLeads: totalLeads > 0 ? (inputs.eventsLeads / totalLeads) * 100 : 0,
      efficiency: 'medium',
    },
    {
      name: 'Content/SEO',
      spend: inputs.contentSpend,
      leads: inputs.contentLeads,
      cpl: inputs.contentLeads > 0 ? (inputs.contentSpend * 1000) / inputs.contentLeads : 0,
      pctSpend: totalSpend > 0 ? (inputs.contentSpend / totalSpend) * 100 : 0,
      pctLeads: totalLeads > 0 ? (inputs.contentLeads / totalLeads) * 100 : 0,
      efficiency: 'medium',
    },
    {
      name: 'Partnerships',
      spend: inputs.partnershipsSpend,
      leads: inputs.partnershipsLeads,
      cpl: inputs.partnershipsLeads > 0 ? (inputs.partnershipsSpend * 1000) / inputs.partnershipsLeads : 0,
      pctSpend: totalSpend > 0 ? (inputs.partnershipsSpend / totalSpend) * 100 : 0,
      pctLeads: totalLeads > 0 ? (inputs.partnershipsLeads / totalLeads) * 100 : 0,
      efficiency: 'medium',
    },
  ];

  // Calculate average CPL for efficiency comparison
  const avgCPL = totalLeads > 0 ? (totalSpend * 1000) / totalLeads : 0;

  // Assign efficiency ratings based on CPL vs average
  channels.forEach(channel => {
    if (channel.leads === 0) {
      channel.efficiency = 'low';
    } else if (channel.cpl < avgCPL * 0.7) {
      channel.efficiency = 'high';
    } else if (channel.cpl > avgCPL * 1.3) {
      channel.efficiency = 'low';
    } else {
      channel.efficiency = 'medium';
    }
  });

  // Sort by spend descending
  const sortedChannels = [...channels].sort((a, b) => b.spend - a.spend);

  // Calculate Marketing Effectiveness metrics
  const marketingROI = totalSpend > 0
    ? (inputs.newCustomersAdded * inputs.avgDealSize) / totalSpend
    : 0;
  const costPerPipelineDollar = metrics.pipelineGenerated > 0
    ? totalSpend / metrics.pipelineGenerated
    : 0;
  const mqlToCustomerRate = inputs.mqlsGenerated > 0
    ? (inputs.newCustomersAdded / inputs.mqlsGenerated) * 100
    : 0;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-4">
        Demand Generation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Mix */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Channel Mix
          </h3>
          <div className="border border-slate-200">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wide">
              <div className="col-span-3">Channel</div>
              <div className="col-span-2 text-right">Spend</div>
              <div className="col-span-2 text-right">Leads</div>
              <div className="col-span-2 text-right">CPL</div>
              <div className="col-span-3 text-right">Efficiency</div>
            </div>

            {/* Rows */}
            {sortedChannels.map((channel, index) => (
              <div
                key={channel.name}
                className={`relative grid grid-cols-12 gap-2 px-4 py-3 ${
                  index < sortedChannels.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                {/* Efficiency indicator */}
                <div
                  className={`absolute left-0 top-0 w-1 h-full ${
                    channel.efficiency === 'high' ? 'bg-emerald-500' :
                    channel.efficiency === 'low' ? 'bg-rose-500' : 'bg-slate-300'
                  }`}
                />

                <div className="col-span-3">
                  <div className="font-medium text-slate-900 text-sm">{channel.name}</div>
                  <div className="text-xs text-slate-500">{channel.pctSpend.toFixed(0)}% of spend</div>
                </div>
                <div className="col-span-2 text-right tabular-nums text-sm text-slate-900">
                  ${channel.spend.toLocaleString()}K
                </div>
                <div className="col-span-2 text-right tabular-nums text-sm text-slate-900">
                  {channel.leads.toLocaleString()}
                </div>
                <div className="col-span-2 text-right tabular-nums text-sm text-slate-900">
                  ${channel.cpl.toFixed(0)}
                </div>
                <div className="col-span-3 text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    channel.efficiency === 'high' ? 'bg-emerald-100 text-emerald-700' :
                    channel.efficiency === 'low' ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {channel.efficiency === 'high' ? 'High' :
                     channel.efficiency === 'low' ? 'Low' : 'Average'}
                  </span>
                </div>
              </div>
            ))}

            {/* Totals Row */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
              <div className="col-span-3 font-semibold text-slate-900 text-sm">Total</div>
              <div className="col-span-2 text-right tabular-nums text-sm font-semibold text-slate-900">
                ${totalSpend.toLocaleString()}K
              </div>
              <div className="col-span-2 text-right tabular-nums text-sm font-semibold text-slate-900">
                {totalLeads.toLocaleString()}
              </div>
              <div className="col-span-2 text-right tabular-nums text-sm font-semibold text-slate-900">
                ${avgCPL.toFixed(0)}
              </div>
              <div className="col-span-3 text-right text-xs text-slate-500">
                Avg CPL
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Effectiveness */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Marketing Effectiveness
          </h3>
          <div className="border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Performance</div>
              <div className="space-y-3">
                <div className="relative flex justify-between items-center py-2">
                  <div className={`absolute left-0 top-0 w-1 h-full ${
                    marketingROI >= 5 ? 'bg-emerald-500' :
                    marketingROI >= 3 ? 'bg-slate-300' : 'bg-rose-500'
                  }`} />
                  <span className="text-sm text-slate-900 pl-3">Marketing ROI</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tabular-nums text-slate-900">
                      {marketingROI.toFixed(1)}:1
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      marketingROI >= 5 ? 'bg-emerald-100 text-emerald-700' :
                      marketingROI >= 3 ? 'bg-slate-100 text-slate-600' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {marketingROI >= 5 ? 'High' : marketingROI >= 3 ? 'Average' : 'Low'}
                    </span>
                  </div>
                </div>
                <div className="relative flex justify-between items-center py-2">
                  <div className={`absolute left-0 top-0 w-1 h-full ${
                    mqlToCustomerRate >= 10 ? 'bg-emerald-500' :
                    mqlToCustomerRate >= 5 ? 'bg-slate-300' : 'bg-rose-500'
                  }`} />
                  <span className="text-sm text-slate-900 pl-3">MQL→Customer Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tabular-nums text-slate-900">
                      {mqlToCustomerRate.toFixed(1)}%
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      mqlToCustomerRate >= 10 ? 'bg-emerald-100 text-emerald-700' :
                      mqlToCustomerRate >= 5 ? 'bg-slate-100 text-slate-600' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {mqlToCustomerRate >= 10 ? 'High' : mqlToCustomerRate >= 5 ? 'Average' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Pipeline Impact</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pipeline Generated</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    ${(metrics.pipelineGenerated / 1000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Marketing Sourced Revenue</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    ${(inputs.newCustomersAdded * inputs.avgDealSize).toLocaleString()}K
                  </span>
                </div>
                {/* Spacer to align with Marketing Efficiency section height */}
                <div className="flex justify-between items-center opacity-0 pointer-events-none">
                  <span className="text-sm text-slate-600">Spacer</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">—</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">ABM Program</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Target Accounts</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    {inputs.targetAccounts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Engaged Accounts</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    {inputs.engagedAccounts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Engagement Rate</span>
                  <span className={`text-sm font-medium tabular-nums ${
                    inputs.targetAccounts > 0 && (inputs.engagedAccounts / inputs.targetAccounts) >= 0.3
                      ? 'text-emerald-600'
                      : 'text-slate-900'
                  }`}>
                    {inputs.targetAccounts > 0 ? ((inputs.engagedAccounts / inputs.targetAccounts) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Efficiency */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Marketing Efficiency
          </h3>
          <div className="border border-slate-200">
            {/* Spend Mix */}
            <div className="p-4 border-b border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Spend Mix</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Paid Media</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    {totalSpend > 0 ? (((inputs.paidSearchSpend + inputs.paidSocialSpend) / totalSpend) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Events</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    {totalSpend > 0 ? ((inputs.eventsSpend / totalSpend) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Content/Partner</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    {totalSpend > 0 ? (((inputs.contentSpend + inputs.partnershipsSpend) / totalSpend) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Pipeline Efficiency */}
            <div className="p-4 border-b border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Pipeline Efficiency</div>
              <div className="space-y-3">
                <div className="relative flex justify-between items-center py-2">
                  <div className={`absolute left-0 top-0 w-1 h-full ${
                    costPerPipelineDollar <= 0.05 ? 'bg-emerald-500' :
                    costPerPipelineDollar <= 0.10 ? 'bg-slate-300' : 'bg-rose-500'
                  }`} />
                  <span className="text-sm text-slate-900 pl-3">Cost per Pipeline $</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tabular-nums text-slate-900">
                      ${costPerPipelineDollar.toFixed(2)}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      costPerPipelineDollar <= 0.05 ? 'bg-emerald-100 text-emerald-700' :
                      costPerPipelineDollar <= 0.10 ? 'bg-slate-100 text-slate-600' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {costPerPipelineDollar <= 0.05 ? 'High' : costPerPipelineDollar <= 0.10 ? 'Average' : 'Low'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Marketing % of S&M</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    {((totalSpend / inputs.totalSalesMarketing) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Marketing CAC</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    ${inputs.newCustomersAdded > 0 ? ((totalSpend * 1000) / inputs.newCustomersAdded).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* ABM Costs */}
            <div className="p-4">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">ABM Program</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total ABM Spend</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    ${inputs.abmSpend.toLocaleString()}K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Cost per Engaged</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    ${inputs.engagedAccounts > 0 ? ((inputs.abmSpend * 1000) / inputs.engagedAccounts).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">ABM % of Spend</span>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    {totalSpend > 0 ? ((inputs.abmSpend / totalSpend) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
