'use client';

import { useState } from 'react';
import { Inputs } from '../types';
import { XMarkIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface InputPanelProps {
  inputs: Inputs;
  onChange: (field: keyof Inputs, value: number) => void;
  onClose: () => void;
  tooltips: Record<string, string>;
}

interface InputGroupProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function InputGroup({ title, icon, children, defaultOpen = true }: InputGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-slate-900">{title}</span>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 space-y-4">
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
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        <span className="flex items-center gap-1.5">
          {label}
          {tooltip && (
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <InformationCircleIcon className="w-4 h-4" />
            </button>
          )}
        </span>
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-medium"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {showTooltip && tooltip && (
        <div className="absolute z-10 left-0 right-0 mt-1 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg">
          {tooltip}
        </div>
      )}
    </div>
  );
}

export default function InputPanel({ inputs, onChange, onClose, tooltips }: InputPanelProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Configure Inputs</h2>
          <p className="text-sm text-slate-500">Adjust your SaaS metrics</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <InputGroup title="Starting Metrics" icon="📊" defaultOpen={true}>
          <InputField
            label="Beginning ARR"
            value={inputs.beginningARR}
            onChange={(v) => onChange('beginningARR', v)}
            tooltip={tooltips.beginningARR}
            suffix="$M"
            step={0.1}
          />
          <InputField
            label="Total Customers"
            value={inputs.totalCustomers}
            onChange={(v) => onChange('totalCustomers', v)}
            tooltip={tooltips.totalCustomers}
          />
        </InputGroup>

        <InputGroup title="Monthly Business" icon="📈" defaultOpen={true}>
          <InputField
            label="New Bookings"
            value={inputs.newBookings}
            onChange={(v) => onChange('newBookings', v)}
            tooltip={tooltips.newBookings}
            suffix="$K"
          />
          <InputField
            label="Expansion ARR"
            value={inputs.expansionARR}
            onChange={(v) => onChange('expansionARR', v)}
            tooltip={tooltips.expansionARR}
            suffix="$K"
          />
          <InputField
            label="Churned ARR"
            value={inputs.churnedARR}
            onChange={(v) => onChange('churnedARR', v)}
            tooltip={tooltips.churnedARR}
            suffix="$K"
          />
          <InputField
            label="Customers Churned"
            value={inputs.customersChurned}
            onChange={(v) => onChange('customersChurned', v)}
            tooltip={tooltips.customersChurned}
          />
          <InputField
            label="New Customers Added"
            value={inputs.newCustomersAdded}
            onChange={(v) => onChange('newCustomersAdded', v)}
            tooltip={tooltips.newCustomersAdded}
          />
        </InputGroup>

        <InputGroup title="Marketing Funnel" icon="🎯" defaultOpen={true}>
          <InputField
            label="MQLs Generated"
            value={inputs.mqlsGenerated}
            onChange={(v) => onChange('mqlsGenerated', v)}
            tooltip={tooltips.mqlsGenerated}
          />
          <InputField
            label="MQL to SQL Conversion"
            value={inputs.mqlToSQLConversion}
            onChange={(v) => onChange('mqlToSQLConversion', v)}
            tooltip={tooltips.mqlToSQLConversion}
            suffix="%"
            step={0.1}
          />
          <InputField
            label="SQL to Opportunity Conversion"
            value={inputs.sqlToOppConversion}
            onChange={(v) => onChange('sqlToOppConversion', v)}
            tooltip={tooltips.sqlToOppConversion}
            suffix="%"
            step={0.1}
          />
          <InputField
            label="Win Rate"
            value={inputs.winRate}
            onChange={(v) => onChange('winRate', v)}
            tooltip={tooltips.winRate}
            suffix="%"
            step={0.1}
          />
          <InputField
            label="Average Deal Size"
            value={inputs.avgDealSize}
            onChange={(v) => onChange('avgDealSize', v)}
            tooltip={tooltips.avgDealSize}
            suffix="$K"
          />
          <InputField
            label="Sales Cycle"
            value={inputs.salesCycle}
            onChange={(v) => onChange('salesCycle', v)}
            tooltip={tooltips.salesCycle}
            suffix="mo"
            step={0.1}
          />
        </InputGroup>

        <InputGroup title="Marketing Spend" icon="💰" defaultOpen={false}>
          <InputField
            label="Total Marketing Spend"
            value={inputs.totalMarketingSpend}
            onChange={(v) => onChange('totalMarketingSpend', v)}
            tooltip={tooltips.totalMarketingSpend}
            suffix="$K"
          />
          <InputField
            label="Paid Marketing Spend"
            value={inputs.paidMarketingSpend}
            onChange={(v) => onChange('paidMarketingSpend', v)}
            tooltip={tooltips.paidMarketingSpend}
            suffix="$K"
          />
          <InputField
            label="Paid Impressions"
            value={inputs.paidImpressions}
            onChange={(v) => onChange('paidImpressions', v)}
            tooltip={tooltips.paidImpressions}
            suffix="K"
          />
          <InputField
            label="Paid Clicks"
            value={inputs.paidClicks}
            onChange={(v) => onChange('paidClicks', v)}
            tooltip={tooltips.paidClicks}
          />
        </InputGroup>

        <InputGroup title="Operating Expenses" icon="🏢" defaultOpen={false}>
          <InputField
            label="Total Sales & Marketing"
            value={inputs.totalSalesMarketing}
            onChange={(v) => onChange('totalSalesMarketing', v)}
            tooltip={tooltips.totalSalesMarketing}
            suffix="$K"
          />
          <InputField
            label="R&D Spend"
            value={inputs.rdSpend}
            onChange={(v) => onChange('rdSpend', v)}
            tooltip={tooltips.rdSpend}
            suffix="$K"
          />
          <InputField
            label="G&A Spend"
            value={inputs.gaSpend}
            onChange={(v) => onChange('gaSpend', v)}
            tooltip={tooltips.gaSpend}
            suffix="$K"
          />
          <InputField
            label="COGS % of Revenue"
            value={inputs.cogsPercent}
            onChange={(v) => onChange('cogsPercent', v)}
            tooltip={tooltips.cogsPercent}
            suffix="%"
            step={0.1}
          />
        </InputGroup>

        <InputGroup title="Customer Lifetime" icon="⏱️" defaultOpen={false}>
          <InputField
            label="Average Customer Lifetime"
            value={inputs.avgCustomerLifetime}
            onChange={(v) => onChange('avgCustomerLifetime', v)}
            tooltip={tooltips.avgCustomerLifetime}
            suffix="mo"
          />
        </InputGroup>
      </div>
    </div>
  );
}
