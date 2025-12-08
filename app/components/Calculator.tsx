'use client';

import { useState } from 'react';
import { Inputs, CalculatedMetrics } from '../types';
import { calculateMetrics } from '../utils/calculator';
import { inputTooltips } from '../utils/inputTooltips';
import InputPanel from './InputPanel';
import ExecutiveBrief from './ExecutiveBrief';
import WhatNeedsAttention from './WhatNeedsAttention';
import WhereToInvest from './WhereToInvest';
import PipelineFunnel from './PipelineFunnel';
import GrowthTrajectory from './GrowthTrajectory';
import UnitEconomicsTable from './UnitEconomicsTable';
import FinancialPosition from './FinancialPosition';
import {
  Cog6ToothIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const defaultInputs: Inputs = {
  beginningARR: 150,
  totalCustomers: 800,
  newBookings: 2400,
  expansionARR: 1600,
  churnedARR: 650,
  customersChurned: 20,
  newCustomersAdded: 14,
  mqlsGenerated: 155,
  mqlToSQLConversion: 42,
  sqlToOppConversion: 68,
  winRate: 32,
  avgDealSize: 175,
  salesCycle: 4.2,
  totalMarketingSpend: 565,
  paidMarketingSpend: 283,
  paidImpressions: 28000,
  paidClicks: 3800,
  totalSalesMarketing: 1125,
  rdSpend: 4500,
  gaSpend: 2600,
  cogsPercent: 15,
  avgCustomerLifetime: 18,
};

export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [metrics, setMetrics] = useState<CalculatedMetrics>(calculateMetrics(defaultInputs));
  const [showInputs, setShowInputs] = useState(false);

  const handleInputChange = (field: keyof Inputs, value: number) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
    setMetrics(calculateMetrics(newInputs));
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setMetrics(calculateMetrics(defaultInputs));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-slate-200 sticky top-0 z-40 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-sm font-medium text-slate-900">SaaS Metrics Model</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Reset to defaults"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={() => setShowInputs(!showInputs)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                  showInputs
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Configure</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Input Panel Overlay */}
      {showInputs && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/10"
            onClick={() => setShowInputs(false)}
          />
          <div className="relative ml-auto w-full max-w-sm bg-white border-l border-slate-200 shadow-xl overflow-y-auto">
            <InputPanel
              inputs={inputs}
              onChange={handleInputChange}
              onClose={() => setShowInputs(false)}
              tooltips={inputTooltips}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Executive Brief */}
        <ExecutiveBrief metrics={metrics} inputs={inputs} />

        {/* Divider */}
        <div className="border-t border-slate-200 my-8" />

        {/* What Needs Attention */}
        <WhatNeedsAttention metrics={metrics} />

        {/* Where to Invest */}
        <WhereToInvest metrics={metrics} inputs={inputs} />

        {/* Pipeline Funnel */}
        <PipelineFunnel metrics={metrics} inputs={inputs} />

        {/* Growth Trajectory */}
        <GrowthTrajectory metrics={metrics} inputs={inputs} />

        {/* Unit Economics */}
        <UnitEconomicsTable metrics={metrics} inputs={inputs} />

        {/* Financial Position */}
        <FinancialPosition metrics={metrics} inputs={inputs} />

        {/* Footer */}
        <footer className="mt-10 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            All calculations update in real-time. Configure inputs to model different scenarios.
          </p>
        </footer>
      </main>
    </div>
  );
}
