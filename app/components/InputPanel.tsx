'use client';

import { useState } from 'react';
import { Inputs } from '../types';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface InputPanelProps {
  inputs: Inputs;
  onChange: (field: keyof Inputs, value: number) => void;
  onClose: () => void;
  tooltips: Record<string, string>;
}

interface InputGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function InputGroup({ title, children, defaultOpen = true }: InputGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left min-h-[56px] sm:min-h-0"
      >
        <span className="text-base sm:text-sm font-semibold sm:font-medium text-slate-900 uppercase tracking-wide">{title}</span>
        <ChevronDownIcon
          className={`w-5 h-5 sm:w-4 sm:h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 sm:px-6 pb-5 sm:pb-4 space-y-4 sm:space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  suffix?: string;
  step?: number;
  min?: number;
}

function InputField({ label, value, onChange, tooltip, suffix, step = 1, min = 0 }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm sm:text-xs text-slate-500 mb-1.5 sm:mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          className="w-full px-4 py-3 sm:px-3 sm:py-2 bg-white border border-slate-200 text-base sm:text-sm tabular-nums text-slate-900 font-medium focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors min-h-[48px] sm:min-h-0"
        />
        {suffix && (
          <span className="absolute right-4 sm:right-3 top-1/2 -translate-y-1/2 text-sm sm:text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function InputPanel({ inputs, onChange, onClose, tooltips }: InputPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-5 sm:py-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-lg font-semibold text-slate-900">Configuration</h2>
          <p className="text-sm sm:text-xs text-slate-500 mt-0.5">Adjust model parameters</p>
        </div>
        <button
          onClick={onClose}
          className="p-3 sm:p-2 hover:bg-slate-100 active:bg-slate-200 transition-colors rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close configuration panel"
        >
          <XMarkIcon className="w-6 h-6 sm:w-5 sm:h-5 text-slate-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <InputGroup title="Starting Position" defaultOpen={true}>
          <InputField
            label="Beginning ARR"
            value={inputs.beginningARR}
            onChange={(v) => onChange('beginningARR', v)}
            suffix="$M"
            step={0.1}
          />
          <InputField
            label="Total Customers"
            value={inputs.totalCustomers}
            onChange={(v) => onChange('totalCustomers', v)}
          />
        </InputGroup>

        <InputGroup title="Monthly Movement" defaultOpen={true}>
          <InputField
            label="Expansion ARR"
            value={inputs.expansionARR}
            onChange={(v) => onChange('expansionARR', v)}
            suffix="$K"
          />
          <InputField
            label="Churned ARR"
            value={inputs.churnedARR}
            onChange={(v) => onChange('churnedARR', v)}
            suffix="$K"
          />
          <InputField
            label="Customers Churned"
            value={inputs.customersChurned}
            onChange={(v) => onChange('customersChurned', v)}
          />
          <InputField
            label="New Customers Added"
            value={inputs.newCustomersAdded}
            onChange={(v) => onChange('newCustomersAdded', v)}
          />
        </InputGroup>

        <InputGroup title="Funnel" defaultOpen={true}>
          <InputField
            label="Leads Generated"
            value={inputs.leadsGenerated}
            onChange={(v) => onChange('leadsGenerated', v)}
          />
          <InputField
            label="MQLs Generated"
            value={inputs.mqlsGenerated}
            onChange={(v) => onChange('mqlsGenerated', v)}
          />
          <InputField
            label="MQL to SQL Rate"
            value={inputs.mqlToSQLConversion}
            onChange={(v) => onChange('mqlToSQLConversion', v)}
            suffix="%"
            step={0.1}
          />
          <InputField
            label="SQL to Opp Rate"
            value={inputs.sqlToOppConversion}
            onChange={(v) => onChange('sqlToOppConversion', v)}
            suffix="%"
            step={0.1}
          />
          <InputField
            label="Win Rate"
            value={inputs.winRate}
            onChange={(v) => onChange('winRate', v)}
            suffix="%"
            step={0.1}
          />
          <InputField
            label="Avg Deal Size"
            value={inputs.avgDealSize}
            onChange={(v) => onChange('avgDealSize', v)}
            suffix="$K"
          />
          <InputField
            label="Sales Cycle"
            value={inputs.salesCycle}
            onChange={(v) => onChange('salesCycle', v)}
            suffix="mo"
            step={0.1}
          />
        </InputGroup>

        <InputGroup title="Channel Mix" defaultOpen={false}>
          <div className="text-sm sm:text-xs text-slate-500 mb-4 sm:mb-3 -mt-1">Spend ($K) and leads by channel</div>

          <div className="space-y-5 sm:space-y-4">
            <div className="border-b border-slate-100 pb-4 sm:pb-3">
              <div className="text-sm sm:text-xs font-medium text-slate-700 mb-3 sm:mb-2">Paid Search (SEM)</div>
              <div className="grid grid-cols-2 gap-3 sm:gap-2">
                <InputField
                  label="Spend"
                  value={inputs.paidSearchSpend}
                  onChange={(v) => onChange('paidSearchSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label="Leads"
                  value={inputs.paidSearchLeads}
                  onChange={(v) => onChange('paidSearchLeads', v)}
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-4 sm:pb-3">
              <div className="text-sm sm:text-xs font-medium text-slate-700 mb-3 sm:mb-2">Paid Social (LinkedIn, Meta)</div>
              <div className="grid grid-cols-2 gap-3 sm:gap-2">
                <InputField
                  label="Spend"
                  value={inputs.paidSocialSpend}
                  onChange={(v) => onChange('paidSocialSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label="Leads"
                  value={inputs.paidSocialLeads}
                  onChange={(v) => onChange('paidSocialLeads', v)}
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-4 sm:pb-3">
              <div className="text-sm sm:text-xs font-medium text-slate-700 mb-3 sm:mb-2">Events & Webinars</div>
              <div className="grid grid-cols-2 gap-3 sm:gap-2">
                <InputField
                  label="Spend"
                  value={inputs.eventsSpend}
                  onChange={(v) => onChange('eventsSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label="Leads"
                  value={inputs.eventsLeads}
                  onChange={(v) => onChange('eventsLeads', v)}
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-4 sm:pb-3">
              <div className="text-sm sm:text-xs font-medium text-slate-700 mb-3 sm:mb-2">Content & SEO</div>
              <div className="grid grid-cols-2 gap-3 sm:gap-2">
                <InputField
                  label="Spend"
                  value={inputs.contentSpend}
                  onChange={(v) => onChange('contentSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label="Leads"
                  value={inputs.contentLeads}
                  onChange={(v) => onChange('contentLeads', v)}
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-4 sm:pb-3">
              <div className="text-sm sm:text-xs font-medium text-slate-700 mb-3 sm:mb-2">Partnerships & Referrals</div>
              <div className="grid grid-cols-2 gap-3 sm:gap-2">
                <InputField
                  label="Spend"
                  value={inputs.partnershipsSpend}
                  onChange={(v) => onChange('partnershipsSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label="Leads"
                  value={inputs.partnershipsLeads}
                  onChange={(v) => onChange('partnershipsLeads', v)}
                />
              </div>
            </div>

            <div className="pb-1">
              <div className="text-sm sm:text-xs font-medium text-slate-700 mb-3 sm:mb-2">ABM Program</div>
              <div className="grid grid-cols-3 gap-3 sm:gap-2">
                <InputField
                  label="Target Accts"
                  value={inputs.targetAccounts}
                  onChange={(v) => onChange('targetAccounts', v)}
                />
                <InputField
                  label="Engaged"
                  value={inputs.engagedAccounts}
                  onChange={(v) => onChange('engagedAccounts', v)}
                />
                <InputField
                  label="ABM Spend"
                  value={inputs.abmSpend}
                  onChange={(v) => onChange('abmSpend', v)}
                  suffix="$K"
                />
              </div>
            </div>
          </div>
        </InputGroup>

        <InputGroup title="Paid Media Detail" defaultOpen={false}>
          <InputField
            label="Paid Impressions"
            value={inputs.paidImpressions}
            onChange={(v) => onChange('paidImpressions', v)}
            suffix="K"
          />
          <InputField
            label="Paid Clicks"
            value={inputs.paidClicks}
            onChange={(v) => onChange('paidClicks', v)}
          />
        </InputGroup>

        <InputGroup title="Operating Expenses" defaultOpen={false}>
          <InputField
            label="Total S&M"
            value={inputs.totalSalesMarketing}
            onChange={(v) => onChange('totalSalesMarketing', v)}
            suffix="$K"
          />
          <InputField
            label="Marketing Spend"
            value={inputs.marketingSpend}
            onChange={(v) => onChange('marketingSpend', v)}
            suffix="$K"
          />
          <InputField
            label="R&D"
            value={inputs.rdSpend}
            onChange={(v) => onChange('rdSpend', v)}
            suffix="$K"
          />
          <InputField
            label="G&A"
            value={inputs.gaSpend}
            onChange={(v) => onChange('gaSpend', v)}
            suffix="$K"
          />
          <InputField
            label="COGS"
            value={inputs.cogsPercent}
            onChange={(v) => onChange('cogsPercent', v)}
            suffix="%"
            step={0.1}
          />
        </InputGroup>

        <InputGroup title="Customer Value" defaultOpen={false}>
          <InputField
            label="Avg Customer Lifetime"
            value={inputs.avgCustomerLifetime}
            onChange={(v) => onChange('avgCustomerLifetime', v)}
            suffix="mo"
          />
        </InputGroup>
      </div>
    </div>
  );
}
