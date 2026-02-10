'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Industry, IndustryConfig, industryConfigs } from '../config/industryConfig';

interface IndustryContextType {
  industry: Industry;
  setIndustry: (industry: Industry) => void;
  config: IndustryConfig;
  getFieldLabel: (field: keyof IndustryConfig['labelMappings']) => string;
  getMetricLabel: (metric: keyof IndustryConfig['metricLabels']) => string;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

interface IndustryProviderProps {
  children: ReactNode;
  initialIndustry?: Industry;
}

export function IndustryProvider({ children, initialIndustry = 'insurance' }: IndustryProviderProps) {
  const [industry, setIndustryState] = useState<Industry>(initialIndustry);
  const [config, setConfig] = useState<IndustryConfig>(industryConfigs[initialIndustry]);

  // Load industry from URL query param or localStorage on mount
  useEffect(() => {
    // Check URL first
    const urlParams = new URLSearchParams(window.location.search);
    const urlVertical = urlParams.get('vertical') as Industry | null;

    if (urlVertical && (urlVertical === 'insurance' || urlVertical === 'banking')) {
      setIndustryState(urlVertical);
      setConfig(industryConfigs[urlVertical]);
      localStorage.setItem('earnix-industry', urlVertical);
      return;
    }

    // Fall back to localStorage
    const stored = localStorage.getItem('earnix-industry') as Industry | null;
    if (stored && (stored === 'insurance' || stored === 'banking')) {
      setIndustryState(stored);
      setConfig(industryConfigs[stored]);

      // Update URL to reflect stored selection
      const url = new URL(window.location.href);
      url.searchParams.set('vertical', stored);
      window.history.replaceState({}, '', url);
    } else {
      // Set default in URL
      const url = new URL(window.location.href);
      url.searchParams.set('vertical', initialIndustry);
      window.history.replaceState({}, '', url);
    }
  }, []);

  // Update industry and persist to localStorage
  const setIndustry = (newIndustry: Industry) => {
    setIndustryState(newIndustry);
    setConfig(industryConfigs[newIndustry]);
    localStorage.setItem('earnix-industry', newIndustry);

    // Update URL query parameter instead of path (avoids 404 on refresh)
    const url = new URL(window.location.href);
    url.searchParams.set('vertical', newIndustry);
    window.history.pushState({}, '', url);
  };

  // Helper functions
  const getFieldLabel = (field: keyof IndustryConfig['labelMappings']): string => {
    return config.labelMappings[field];
  };

  const getMetricLabel = (metric: keyof IndustryConfig['metricLabels']): string => {
    return config.metricLabels[metric];
  };

  return (
    <IndustryContext.Provider
      value={{
        industry,
        setIndustry,
        config,
        getFieldLabel,
        getMetricLabel,
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
}

// Custom hook for using industry context
export function useIndustry() {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
}
