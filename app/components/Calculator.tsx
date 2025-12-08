'use client';

import { useState } from 'react';
import { Inputs, CalculatedMetrics } from '../types';
import { calculateMetrics, getKeyMetrics } from '../utils/calculator';
import { inputTooltips } from '../utils/inputTooltips';
import InputPanel from './InputPanel';
import MarketingScorecard from './MarketingScorecard';
import FunnelMetrics from './FunnelMetrics';
import UnitEconomics from './UnitEconomics';
import GrowthHealth from './GrowthHealth';
import FinancialHealth from './FinancialHealth';
import {
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const defaultInputs: Inputs = {
  beginningARR: 150,
  totalCustomers: 800,
  newBookings: 2400,
  expansionARR: 1600,
  churnedARR: 650,
  customersChurned: 4,
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

  const keyMetrics = getKeyMetrics(metrics);

  // Calculate overall health score (0-100)
  const healthScore = Math.round(
    (keyMetrics.filter(m => m.status === 'good').length / keyMetrics.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">SaaS Metrics</h1>
                <p className="text-xs text-slate-500">B2B Marketing Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Health Score Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <div className={`w-2 h-2 rounded-full ${
                  healthScore >= 70 ? 'bg-green-500' : healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium text-slate-700">
                  Health: {healthScore}%
                </span>
              </div>

              <button
                onClick={() => setShowInputs(!showInputs)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  showInputs
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Configure</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all"
                title="Reset to defaults"
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Input Panel Overlay */}
      {showInputs && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setShowInputs(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl overflow-y-auto">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketing Scorecard - Top Level Summary */}
        <MarketingScorecard
          metrics={metrics}
          keyMetrics={keyMetrics}
          healthScore={healthScore}
        />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Funnel Metrics */}
          <FunnelMetrics
            inputs={inputs}
            metrics={metrics}
          />

          {/* Unit Economics */}
          <UnitEconomics
            metrics={metrics}
            inputs={inputs}
          />
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Growth & Retention */}
          <GrowthHealth
            metrics={metrics}
            inputs={inputs}
          />

          {/* Financial Health */}
          <FinancialHealth
            metrics={metrics}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200">
          <p className="text-center text-sm text-slate-500">
            Built for B2B SaaS Marketing Teams • All calculations update in real-time
          </p>
        </footer>
      </main>
    </div>
  );
}
