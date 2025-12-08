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
        className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors text-left"
      >
        <span className="text-sm font-medium text-slate-900 uppercase tracking-wide">{title}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 space-y-3">
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
      <label className="block text-xs text-slate-500 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          className="w-full px-3 py-2 bg-white border border-slate-200 text-sm tabular-nums text-slate-900 font-medium focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
          <p className="text-xs text-slate-500">Adjust model parameters</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-slate-500" />
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
            label="New Bookings"
            value={inputs.newBookings}
            onChange={(v) => onChange('newBookings', v)}
            suffix="$K"
          />
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

        <InputGroup title="Marketing Spend" defaultOpen={false}>
          <InputField
            label="Total Marketing"
            value={inputs.totalMarketingSpend}
            onChange={(v) => onChange('totalMarketingSpend', v)}
            suffix="$K"
          />
          <InputField
            label="Paid Marketing"
            value={inputs.paidMarketingSpend}
            onChange={(v) => onChange('paidMarketingSpend', v)}
            suffix="$K"
          />
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
