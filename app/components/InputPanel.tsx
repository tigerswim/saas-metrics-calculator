'use client';

import { useState } from 'react';
import { Inputs } from '../types';
import { useIndustry } from '../contexts/IndustryContext';
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
          className="w-full px-3 py-2 bg-white border border-slate-200 text-sm tabular-nums text-slate-900 font-medium focus:ring-1 focus:ring-earnix-orange focus:border-earnix-orange outline-none transition-colors"
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
  const { getFieldLabel } = useIndustry();

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
            label={getFieldLabel('beginningARR')}
            value={inputs.beginningARR}
            onChange={(v) => onChange('beginningARR', v)}
            suffix="$M"
            step={0.1}
          />
          <InputField
            label={getFieldLabel('totalCustomers')}
            value={inputs.totalCustomers}
            onChange={(v) => onChange('totalCustomers', v)}
          />
        </InputGroup>

        <InputGroup title="Monthly Movement" defaultOpen={true}>
          <InputField
            label={getFieldLabel('expansionARR')}
            value={inputs.expansionARR}
            onChange={(v) => onChange('expansionARR', v)}
            suffix="$K"
          />
          <InputField
            label={getFieldLabel('churnedARR')}
            value={inputs.churnedARR}
            onChange={(v) => onChange('churnedARR', v)}
            suffix="$K"
          />
          <InputField
            label={getFieldLabel('customersChurned')}
            value={inputs.customersChurned}
            onChange={(v) => onChange('customersChurned', v)}
          />
          <InputField
            label={getFieldLabel('newCustomersAdded')}
            value={inputs.newCustomersAdded}
            onChange={(v) => onChange('newCustomersAdded', v)}
          />
        </InputGroup>

        <InputGroup title="Funnel" defaultOpen={true}>
          <InputField
            label={getFieldLabel('leadsGenerated')}
            value={inputs.leadsGenerated}
            onChange={(v) => onChange('leadsGenerated', v)}
          />
          <InputField
            label={getFieldLabel('mqlsGenerated')}
            value={inputs.mqlsGenerated}
            onChange={(v) => onChange('mqlsGenerated', v)}
          />
          <InputField
            label={getFieldLabel('mqlToSQLConversion')}
            value={inputs.mqlToSQLConversion}
            onChange={(v) => onChange('mqlToSQLConversion', v)}
            suffix="%"
            step={0.1}
          />
          <InputField
            label={getFieldLabel('sqlToOppConversion')}
            value={inputs.sqlToOppConversion}
            onChange={(v) => onChange('sqlToOppConversion', v)}
            suffix="%"
            step={0.1}
          />
          <InputField
            label={getFieldLabel('winRate')}
            value={inputs.winRate}
            onChange={(v) => onChange('winRate', v)}
            suffix="%"
            step={0.1}
          />
          <InputField
            label={getFieldLabel('avgDealSize')}
            value={inputs.avgDealSize}
            onChange={(v) => onChange('avgDealSize', v)}
            suffix="$K"
          />
          <InputField
            label={getFieldLabel('salesCycle')}
            value={inputs.salesCycle}
            onChange={(v) => onChange('salesCycle', v)}
            suffix="mo"
            step={0.1}
          />
        </InputGroup>

        <InputGroup title="Channel Mix" defaultOpen={false}>
          <div className="text-xs text-slate-500 mb-3 -mt-1">Spend ($K) and leads by channel</div>

          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-medium text-slate-700 mb-2">
                {getFieldLabel('paidSearchSpend').split(' Spend')[0]}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InputField
                  label="Spend"
                  value={inputs.paidSearchSpend}
                  onChange={(v) => onChange('paidSearchSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label={getFieldLabel('paidSearchLeads').replace('Paid Search ', '')}
                  value={inputs.paidSearchLeads}
                  onChange={(v) => onChange('paidSearchLeads', v)}
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-medium text-slate-700 mb-2">
                {getFieldLabel('paidSocialSpend').split(' Spend')[0]}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InputField
                  label="Spend"
                  value={inputs.paidSocialSpend}
                  onChange={(v) => onChange('paidSocialSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label={getFieldLabel('paidSocialLeads').replace('Paid Social ', '')}
                  value={inputs.paidSocialLeads}
                  onChange={(v) => onChange('paidSocialLeads', v)}
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-medium text-slate-700 mb-2">
                {getFieldLabel('eventsSpend').split(' Spend')[0]}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InputField
                  label="Spend"
                  value={inputs.eventsSpend}
                  onChange={(v) => onChange('eventsSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label={getFieldLabel('eventsLeads').replace('Events ', '')}
                  value={inputs.eventsLeads}
                  onChange={(v) => onChange('eventsLeads', v)}
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-medium text-slate-700 mb-2">
                {getFieldLabel('contentSpend').split(' Spend')[0]}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InputField
                  label="Spend"
                  value={inputs.contentSpend}
                  onChange={(v) => onChange('contentSpend', v)}
                  suffix="$K"
                />
                <InputField
                  label={getFieldLabel('contentLeads').replace('Content ', '')}
                  value={inputs.contentLeads}
                  onChange={(v) => onChange('contentLeads', v)}
                />
              </div>
            </div>

            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-medium text-slate-700 mb-2">
                {getFieldLabel('partnershipsSpend').split(' Spend')[0]}
              </div>
              <div className="grid grid-cols-2 gap-2">
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
              <div className="text-xs font-medium text-slate-700 mb-2">
                {getFieldLabel('abmSpend').replace(' Spend', '')}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <InputField
                  label={getFieldLabel('targetAccounts').replace('Target ', '')}
                  value={inputs.targetAccounts}
                  onChange={(v) => onChange('targetAccounts', v)}
                />
                <InputField
                  label={getFieldLabel('engagedAccounts').replace('Engaged ', '')}
                  value={inputs.engagedAccounts}
                  onChange={(v) => onChange('engagedAccounts', v)}
                />
                <InputField
                  label="Spend"
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
            label={getFieldLabel('paidImpressions')}
            value={inputs.paidImpressions}
            onChange={(v) => onChange('paidImpressions', v)}
            suffix="K"
          />
          <InputField
            label={getFieldLabel('paidClicks')}
            value={inputs.paidClicks}
            onChange={(v) => onChange('paidClicks', v)}
          />
        </InputGroup>

        <InputGroup title="Operating Expenses" defaultOpen={false}>
          <InputField
            label={getFieldLabel('totalSalesMarketing')}
            value={inputs.totalSalesMarketing}
            onChange={(v) => onChange('totalSalesMarketing', v)}
            suffix="$K"
          />
          <InputField
            label={getFieldLabel('marketingSpend')}
            value={inputs.marketingSpend}
            onChange={(v) => onChange('marketingSpend', v)}
            suffix="$K"
          />
          <InputField
            label={getFieldLabel('rdSpend')}
            value={inputs.rdSpend}
            onChange={(v) => onChange('rdSpend', v)}
            suffix="$K"
          />
          <InputField
            label={getFieldLabel('gaSpend')}
            value={inputs.gaSpend}
            onChange={(v) => onChange('gaSpend', v)}
            suffix="$K"
          />
          <InputField
            label={getFieldLabel('cogsPercent')}
            value={inputs.cogsPercent}
            onChange={(v) => onChange('cogsPercent', v)}
            suffix="%"
            step={0.1}
          />
        </InputGroup>

        <InputGroup title="Customer Value" defaultOpen={false}>
          <InputField
            label={getFieldLabel('avgCustomerLifetime')}
            value={inputs.avgCustomerLifetime}
            onChange={(v) => onChange('avgCustomerLifetime', v)}
            suffix="mo"
          />
        </InputGroup>
      </div>
    </div>
  );
}
