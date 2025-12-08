'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RuleOf40GaugeProps {
  growthRate: number;
  ebitdaMargin: number;
  ruleOf40: number;
}

export default function RuleOf40Gauge({ growthRate, ebitdaMargin, ruleOf40 }: RuleOf40GaugeProps) {
  // Normalize value to 0-100 range for gauge
  const normalizedValue = Math.min(Math.max(ruleOf40, 0), 100);
  const gaugeValue = normalizedValue;
  const remaining = 100 - gaugeValue;

  const data = [
    { value: gaugeValue },
    { value: remaining },
  ];

  // Color based on Rule of 40 zones
  const getColor = () => {
    if (ruleOf40 < 40) return '#ef4444'; // Red
    if (ruleOf40 < 60) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  const getStatus = () => {
    if (ruleOf40 < 40) return 'Needs Improvement';
    if (ruleOf40 < 60) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Rule of 40</h3>
      <p className="text-sm text-slate-600 mb-4">Growth + Profitability efficiency metric</p>

      <div className="relative" style={{ height: '180px' }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="75%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="85%"
              dataKey="value"
              stroke="none"
            >
              <Cell fill={getColor()} />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <div className="text-3xl font-bold" style={{ color: getColor() }}>
            {ruleOf40.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-600 mt-1">{getStatus()}</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Growth Rate:</span>
          <span className="font-semibold text-slate-900">{growthRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">EBITDA Margin:</span>
          <span className="font-semibold text-slate-900">{ebitdaMargin.toFixed(1)}%</span>
        </div>
        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-slate-900">Rule of 40:</span>
            <span style={{ color: getColor() }}>{ruleOf40.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>&lt;40%: Needs Improvement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>40-60%: Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>&gt;60%: Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
