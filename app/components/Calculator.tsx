'use client';

import { useState, useEffect } from 'react';
import { Inputs, CalculatedMetrics } from '../types';
import { calculateMetrics } from '../utils/calculator';
import { inputTooltips } from '../utils/inputTooltips';
import { useIndustry } from '../contexts/IndustryContext';
import { useIndustryTheme } from '../hooks/useIndustryTheme';
import InputPanel from './InputPanel';
import ExecutiveBrief from './ExecutiveBrief';
import WhatNeedsAttention from './WhatNeedsAttention';
import WhereToInvest from './WhereToInvest';
import PipelineFunnel from './PipelineFunnel';
import GrowthTrajectory from './GrowthTrajectory';
import UnitEconomicsTable from './UnitEconomicsTable';
import FinancialPosition from './FinancialPosition';
import ChannelMix from './ChannelMix';
import VerticalMetricsMap from './metrics-map-v2/VerticalMetricsMap';
import ReactFlowMetricsMap from './metrics-map-v3/ReactFlowMetricsMap';
// Methodology component available at ./Methodology.tsx - uncomment import to enable
// import Methodology from './Methodology';
import {
  Cog6ToothIcon,
  ArrowPathIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

// Persona types for different stakeholder views
type Persona = 'all' | 'ceo' | 'cfo' | 'sales' | 'marketing';

interface PersonaConfig {
  label: string;
  shortLabel: string;
  description: string;
  sections: string[];
}

// Note: personaConfigs will be updated dynamically based on industry
function getPersonaConfigs(industryConfig: any): Record<Persona, PersonaConfig> {
  return {
    all: {
      label: 'All Metrics',
      shortLabel: 'All',
      description: '',
      sections: ['brief', 'attention', 'invest', 'channels', 'pipeline', 'growth', 'economics', 'financial'],
    },
    ceo: {
      label: industryConfig.personaLabels.ceo,
      shortLabel: 'CEO',
      description: '',
      sections: ['brief', 'attention', 'growth', 'financial'],
    },
    cfo: {
      label: industryConfig.personaLabels.cfo,
      shortLabel: 'CFO',
      description: '',
      sections: ['brief', 'attention', 'economics', 'financial'],
    },
    sales: {
      label: 'CRO',
      shortLabel: 'CRO',
      description: '',
      sections: ['brief', 'pipeline', 'invest', 'growth'],
    },
    marketing: {
      label: 'CMO',
      shortLabel: 'CMO',
      description: '',
      sections: ['brief', 'attention', 'channels', 'invest', 'pipeline', 'economics'],
    },
  };
}

const defaultInputs: Inputs = {
  beginningARR: 150,
  totalCustomers: 800,
  expansionARR: 1600,
  churnedARR: 650,
  customersChurned: 20,
  newCustomersAdded: 14,
  leadsGenerated: 620,
  mqlsGenerated: 155,
  mqlToSQLConversion: 42,
  sqlToOppConversion: 68,
  winRate: 32,
  avgDealSize: 175,
  salesCycle: 4.2,
  // Channel mix (spend in $K, leads as count)
  paidSearchSpend: 120,
  paidSearchLeads: 180,
  paidSocialSpend: 165,
  paidSocialLeads: 140,
  eventsSpend: 80,
  eventsLeads: 65,
  contentSpend: 45,
  contentLeads: 175,
  partnershipsSpend: 15,
  partnershipsLeads: 60,
  // ABM metrics
  targetAccounts: 250,
  engagedAccounts: 85,
  abmSpend: 140,
  // Paid media detail
  paidImpressions: 28000,
  paidClicks: 3800,
  totalSalesMarketing: 1125,
  marketingSpend: 565, // Sum of all marketing channels (120+165+80+45+15+140)
  rdSpend: 4500,
  gaSpend: 2600,
  cogsPercent: 15,
  avgCustomerLifetime: 18,
};

type ViewMode = 'sections' | 'map';

export default function Calculator() {
  const { industry, setIndustry, config } = useIndustry();
  const theme = useIndustryTheme();
  const [inputs, setInputs] = useState<Inputs>(config.defaultInputs);
  const [metrics, setMetrics] = useState<CalculatedMetrics>(calculateMetrics(config.defaultInputs));
  const [showInputs, setShowInputs] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('sections');
  const [mapVersion, setMapVersion] = useState<'v2' | 'v3'>('v3'); // Default to v3 (React Flow)
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  const personaConfigs = getPersonaConfigs(config);
  const currentConfig = personaConfigs[activePersona];
  const showSection = (section: string) => currentConfig.sections.includes(section);

  // Update inputs when industry changes
  useEffect(() => {
    setInputs(config.defaultInputs);
    setMetrics(calculateMetrics(config.defaultInputs));
  }, [industry, config.defaultInputs]);

  const handleInputChange = (field: keyof Inputs, value: number) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
    setMetrics(calculateMetrics(newInputs));
  };

  const handleReset = () => {
    setInputs(config.defaultInputs);
    setMetrics(calculateMetrics(config.defaultInputs));
  };

  const handleIndustryChange = (newIndustry: 'insurance' | 'banking') => {
    setIndustry(newIndustry);
    setShowIndustryDropdown(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <header className="border-b border-slate-200 sticky top-0 z-40 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 gap-4">
            {/* Customer Vertical Selector */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors border border-slate-300"
              >
                <span className="hidden sm:inline text-slate-500">Vertical:</span>
                <span className="font-semibold">{config.displayName}</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>

              {showIndustryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded shadow-lg z-50">
                  <button
                    onClick={() => handleIndustryChange('insurance')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                      industry === 'insurance' ? 'bg-slate-100 font-semibold' : ''
                    }`}
                  >
                    <div className="font-medium">Insurance</div>
                    <div className="text-xs text-slate-500">Selling to insurance carriers</div>
                  </button>
                  <button
                    onClick={() => handleIndustryChange('banking')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                      industry === 'banking' ? 'bg-slate-100 font-semibold' : ''
                    }`}
                  >
                    <div className="font-medium">Banking</div>
                    <div className="text-xs text-slate-500">Selling to financial institutions</div>
                  </button>
                </div>
              )}
            </div>

            {/* Persona Toggle */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs text-slate-500 mr-2 hidden sm:inline">View:</span>
              {(Object.keys(personaConfigs) as Persona[]).map((persona) => (
                <button
                  key={persona}
                  onClick={() => setActivePersona(persona)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                    activePersona === persona
                      ? 'bg-earnix-orange text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                  title={personaConfigs[persona].description}
                >
                  <span className="hidden sm:inline">{personaConfigs[persona].label}</span>
                  <span className="sm:hidden">{personaConfigs[persona].shortLabel}</span>
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs text-slate-500 mr-2 hidden sm:inline">Layout:</span>
              <button
                onClick={() => setViewMode('sections')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === 'sections'
                    ? 'bg-earnix-orange text-white'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title="Sections View"
              >
                <Squares2X2Icon className="w-4 h-4" />
                <span className="hidden sm:inline">Sections</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === 'map'
                    ? 'bg-earnix-orange text-white'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title="Metrics Map View"
              >
                <RectangleGroupIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                title="Reset to defaults"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={() => setShowInputs(!showInputs)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  showInputs
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
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

      {/* Hero Title Section */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold earnix-headline">
              Earnix SaaS Metrics Calculator
            </h1>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${theme.badgeBg} ${theme.badgeText} transition-all duration-300`}>
              {config.displayName.toUpperCase()}
            </span>
          </div>
          <p className="text-slate-600 mt-2">
            {config.displayName} vertical • Enterprise SaaS metrics modeling
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Executive Brief - Always shown */}
        {showSection('brief') && (
          <ExecutiveBrief metrics={metrics} inputs={inputs} />
        )}

        {/* Divider after brief */}
        {showSection('brief') && viewMode === 'sections' && (showSection('attention') || showSection('invest') || showSection('pipeline') || showSection('growth') || showSection('economics') || showSection('financial')) && (
          <div className="border-t border-slate-200 my-8" />
        )}

        {/* Conditional rendering based on view mode */}
        {viewMode === 'map' ? (
          /* Metrics Map View */
          <>
            {/* Map Version Toggle */}
            <div className="mb-4 flex items-center justify-end gap-2">
              <span className="text-xs text-slate-500">Map Version:</span>
              <button
                onClick={() => setMapVersion('v2')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  mapVersion === 'v2'
                    ? 'bg-earnix-orange text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Vertical (v2)
              </button>
              <button
                onClick={() => setMapVersion('v3')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  mapVersion === 'v3'
                    ? 'bg-earnix-orange text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Flow Graph (v3)
              </button>
            </div>

            {/* Render selected map version */}
            {mapVersion === 'v2' ? (
              <VerticalMetricsMap metrics={metrics} inputs={inputs} />
            ) : (
              <ReactFlowMetricsMap metrics={metrics} inputs={inputs} />
            )}

            {/* Keep detailed tables as expandable sections below map */}
            {showSection('economics') && (
              <div className="mt-8">
                <UnitEconomicsTable metrics={metrics} inputs={inputs} />
              </div>
            )}
            {showSection('financial') && (
              <div className="mt-8">
                <FinancialPosition metrics={metrics} inputs={inputs} />
              </div>
            )}
          </>
        ) : (
          /* Sections View */
          <>
            {/* What Needs Attention */}
            {showSection('attention') && (
              <WhatNeedsAttention metrics={metrics} />
            )}

            {/* Where to Invest */}
            {showSection('invest') && (
              <WhereToInvest metrics={metrics} inputs={inputs} />
            )}

            {/* Channel Mix */}
            {showSection('channels') && (
              <ChannelMix inputs={inputs} metrics={metrics} />
            )}

            {/* Pipeline Funnel */}
            {showSection('pipeline') && (
              <PipelineFunnel metrics={metrics} inputs={inputs} />
            )}

            {/* Growth Trajectory */}
            {showSection('growth') && (
              <GrowthTrajectory metrics={metrics} inputs={inputs} />
            )}

            {/* Unit Economics */}
            {showSection('economics') && (
              <UnitEconomicsTable metrics={metrics} inputs={inputs} />
            )}

            {/* Financial Position */}
            {showSection('financial') && (
              <FinancialPosition metrics={metrics} inputs={inputs} />
            )}
          </>
        )}

        {/* Methodology & Sources - disabled for now, component available at ./Methodology.tsx */}
        {/* <Methodology /> */}

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
