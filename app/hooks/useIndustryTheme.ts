import { useIndustry } from '../contexts/IndustryContext';

export type ThemeColors = {
  primary: string;
  primaryHover: string;
  light: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  goodStatus: string;
  goodStatusBg: string;
  goodStatusBorder: string;
};

export function useIndustryTheme(): ThemeColors {
  const { industry } = useIndustry();

  if (industry === 'insurance') {
    return {
      primary: 'bg-insurance-primary', // Deep Teal
      primaryHover: 'hover:bg-cyan-700',
      light: 'bg-insurance-light',
      accent: 'text-insurance-primary',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
      borderAccent: 'border-l-insurance-primary',
      goodStatus: 'text-purple-700',
      goodStatusBg: 'bg-purple-50',
      goodStatusBorder: 'border-purple-500',
    };
  }

  // Banking
  return {
    primary: 'bg-banking-primary', // Earnix Orange
    primaryHover: 'hover:bg-earnix-orange-dark',
    light: 'bg-banking-light',
    accent: 'text-banking-primary',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
    borderAccent: 'border-l-banking-primary',
    goodStatus: 'text-cyan-700',
    goodStatusBg: 'bg-cyan-50',
    goodStatusBorder: 'border-cyan-500',
  };
}

// Helper function to get raw color values for dynamic styles
export function getThemeColorValue(industry: 'insurance' | 'banking'): {
  primary: string;
  primaryRgb: string;
} {
  if (industry === 'insurance') {
    return {
      primary: '#0891b2', // cyan-600
      primaryRgb: '8, 145, 178',
    };
  }
  return {
    primary: '#F44D2E', // Earnix orange
    primaryRgb: '244, 77, 46',
  };
}
