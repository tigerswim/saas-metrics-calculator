'use client';

import { Inputs } from '../types';
import Tooltip from './Tooltip';

interface InputItem {
  label: string;
  field: keyof Inputs;
  value: number;
  step?: number;
  tooltip?: string;
}

interface InputSectionProps {
  title: string;
  inputs: InputItem[];
  onChange: (field: keyof Inputs, value: number) => void;
}

export default function InputSection({ title, inputs, onChange }: InputSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {inputs.map((input) => (
          <div key={input.field}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <span className="inline-flex items-center">
                {input.label}
                {input.tooltip && <Tooltip content={input.tooltip} />}
              </span>
            </label>
            <input
              type="number"
              value={input.value}
              onChange={(e) => onChange(input.field, parseFloat(e.target.value) || 0)}
              step={input.step || 0.1}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
