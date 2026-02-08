'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Inputs } from '../types';

interface FormulaExplainerProps {
  metricName: 'logoChurn';
  inputs: Inputs;
  result: number;
}

export default function FormulaExplainer({ metricName, inputs, result }: FormulaExplainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formulas = {
    logoChurn: {
      name: 'Logo Churn Rate',
      formula: 'Customers Churned / Total Customers × 100',
      explanation: 'The percentage of your customer base that cancelled during the period.',
      calculation: [
        `Total Customers: ${inputs.totalCustomers}`,
        `Customers Churned: ${inputs.customersChurned}`,
        `Logo Churn = ${inputs.customersChurned} / ${inputs.totalCustomers} × 100`,
        `Logo Churn = ${result.toFixed(2)}%`,
      ],
      interpretation: 'Target <1.5% per month (<18% annually). This is customer-count based, not revenue-based.',
    },
  };

  const formula = formulas[metricName];

  return (
    <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-sm font-medium text-slate-700"
      >
        <span>View Calculation</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="p-4 bg-white text-sm space-y-3">
          <div>
            <div className="font-semibold text-slate-900 mb-1">{formula.name}</div>
            <div className="text-slate-600">{formula.explanation}</div>
          </div>

          <div>
            <div className="font-semibold text-slate-900 mb-1">Formula:</div>
            <div className="bg-slate-50 p-2 rounded font-mono text-xs text-slate-700">
              {formula.formula}
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-900 mb-1">Calculation:</div>
            <div className="space-y-1">
              {formula.calculation.map((step, index) => (
                <div key={index} className="text-slate-700">
                  {index === formula.calculation.length - 1 ? (
                    <div className="font-semibold text-retention-600 mt-2">{step}</div>
                  ) : (
                    <div>{step}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">Interpretation:</div>
            <div className="text-slate-600">{formula.interpretation}</div>
          </div>
        </div>
      )}
    </div>
  );
}
