'use client';

import { CalculatedMetrics, KeyMetric } from '../types';
import MetricTooltip from './MetricTooltip';
import { getMetricDefinition } from '../utils/metricDefinitions';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
} from '@heroicons/react/24/solid';

interface MarketingScorecardProps {
  metrics: CalculatedMetrics;
  keyMetrics: KeyMetric[];
  healthScore: number;
}

function getInsight(keyMetrics: KeyMetric[], metrics: CalculatedMetrics): { type: 'success' | 'warning' | 'action'; message: string } {
  // Find the most pressing issue or highlight
  const badMetrics = keyMetrics.filter(m => m.status === 'bad');
  const warningMetrics = keyMetrics.filter(m => m.status === 'warning');

  if (metrics.ltvCacRatio < 3) {
    return {
      type: 'action',
      message: `LTV:CAC of ${metrics.ltvCacRatio.toFixed(1)}x is below the 3x target. Consider increasing deal size or reducing CAC.`
    };
  }

  if (metrics.cacPaybackPeriod > 18) {
    return {
      type: 'warning',
      message: `CAC Payback of ${metrics.cacPaybackPeriod.toFixed(0)} months exceeds 18-month threshold. Focus on improving conversion rates.`
    };
  }

  if (metrics.annualizedGRR < 90) {
    return {
      type: 'warning',
      message: `GRR of ${metrics.annualizedGRR.toFixed(0)}% indicates retention issues. Prioritize customer success initiatives.`
    };
  }

  if (metrics.magicNumber < 0.75) {
    return {
      type: 'action',
      message: `Magic Number of ${metrics.magicNumber.toFixed(2)}x suggests S&M spend efficiency needs improvement.`
    };
  }

  if (badMetrics.length > 0) {
    return {
      type: 'warning',
      message: `${badMetrics.length} metric(s) need attention: ${badMetrics.map(m => m.name).join(', ')}`
    };
  }

  if (warningMetrics.length > 2) {
    return {
      type: 'warning',
      message: `${warningMetrics.length} metrics are in warning status. Review funnel efficiency.`
    };
  }

  return {
    type: 'success',
    message: 'Marketing metrics are healthy. Focus on scaling acquisition while maintaining efficiency.'
  };
}

export default function MarketingScorecard({ metrics, keyMetrics, healthScore }: MarketingScorecardProps) {
  const insight = getInsight(keyMetrics, metrics);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'bad':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'bad':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'action':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Marketing Performance Scorecard</h2>
            <p className="text-slate-400 text-sm mt-1">Key metrics that drive B2B SaaS growth</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${(metrics.endingARR).toFixed(1)}M</div>
              <div className="text-sm text-slate-400">Ending ARR</div>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
              healthScore >= 70 ? 'bg-green-500 text-white' :
              healthScore >= 40 ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {healthScore}
            </div>
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      <div className={`px-6 py-3 border-b flex items-start gap-3 ${getInsightStyle(insight.type)}`}>
        <LightBulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium">{insight.message}</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
        {keyMetrics.map((metric) => {
          const definition = getMetricDefinition(metric.name);
          return (
            <div
              key={metric.name}
              className={`metric-card rounded-xl p-4 border ${getStatusBg(metric.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {metric.name}
                  </span>
                  {definition && (
                    <MetricTooltip
                      formula={definition.formula}
                      description={definition.description}
                      impact={definition.impact}
                    />
                  )}
                </div>
                {getStatusIcon(metric.status)}
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500">
                Target: {metric.target}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200">
        <div className="bg-white p-4 text-center">
          <div className="text-sm text-slate-500 mb-1">Net New ARR</div>
          <div className={`text-xl font-bold ${metrics.netNewARR >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.netNewARR >= 0 ? '+' : ''}${(metrics.netNewARR / 1000).toFixed(1)}M
          </div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-sm text-slate-500 mb-1">Annualized Growth</div>
          <div className={`text-xl font-bold flex items-center justify-center gap-1 ${
            metrics.annualizedGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.annualizedGrowthRate >= 0 ? (
              <ArrowTrendingUpIcon className="w-5 h-5" />
            ) : (
              <ArrowTrendingDownIcon className="w-5 h-5" />
            )}
            {metrics.annualizedGrowthRate.toFixed(0)}%
          </div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-sm text-slate-500 mb-1">Customers</div>
          <div className="text-xl font-bold text-slate-900">
            {metrics.endingCustomerCount.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-sm text-slate-500 mb-1">ARPA</div>
          <div className="text-xl font-bold text-slate-900">
            ${Math.round(metrics.arpa).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
