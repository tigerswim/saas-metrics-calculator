// Metrics relationship graph - defines how metrics connect and influence each other

export interface MetricRelationship {
  inputs: string[];  // Metrics that feed into this metric
  outputs: string[]; // Metrics that this metric influences
}

export type MetricsGraph = Record<string, MetricRelationship>;

/**
 * Complete relationship graph for all metrics in the calculator.
 * This defines the causal connections shown in the vertical flow diagram.
 */
export const metricsRelationships: MetricsGraph = {
  // ============================================================
  // BUDGET LAYER - Top level organizational spend
  // ============================================================

  'sales-marketing-spend': {
    inputs: [],
    outputs: ['marketing-spend', 'sales-spend', 'cac-blended', 'magic-number'],
  },

  'marketing-spend': {
    inputs: ['sales-marketing-spend'],
    outputs: ['paid-search', 'paid-social', 'events', 'content', 'partnerships', 'abm', 'cost-per-mql', 'cost-per-sql', 'cost-per-opp', 'cost-per-won'],
  },

  'sales-spend': {
    inputs: ['sales-marketing-spend'],
    outputs: [],
  },

  'rd-spend': {
    inputs: [],
    outputs: ['total-opex'],
  },

  'ga-spend': {
    inputs: [],
    outputs: ['total-opex'],
  },

  'total-opex': {
    inputs: ['rd-spend', 'ga-spend'],
    outputs: ['ebitda']
  },

  // ============================================================
  // ACTIVITIES LAYER - Marketing channel components
  // ============================================================

  'paid-search': {
    inputs: ['marketing-spend'],
    outputs: ['impressions'],
  },

  'paid-social': {
    inputs: ['marketing-spend'],
    outputs: ['impressions'],
  },

  'events': {
    inputs: ['marketing-spend'],
    outputs: ['leads'],
  },

  'content': {
    inputs: ['marketing-spend'],
    outputs: ['leads'],
  },

  'partnerships': {
    inputs: ['marketing-spend'],
    outputs: ['leads'],
  },

  'abm': {
    inputs: ['marketing-spend'],
    outputs: ['leads'],
  },

  // ============================================================
  // ACQUISITION LAYER - Funnel metrics
  // ============================================================

  // ============================================================
  // ACQUISITION LAYER - Funnel metrics
  // ============================================================

  'impressions': {
    inputs: ['paid-search', 'paid-social'],
    outputs: ['clicks', 'cpm', 'ctr']
  },

  'clicks': {
    inputs: ['impressions'],
    outputs: ['leads', 'ctr', 'cpc']
  },

  'cpm': {
    inputs: ['impressions'],
    outputs: []
  },

  'cpc': {
    inputs: ['clicks'],
    outputs: []
  },

  'ctr': {
    inputs: ['impressions', 'clicks'],
    outputs: []
  },

  'leads': {
    inputs: ['clicks', 'events', 'content', 'partnerships', 'abm'],
    outputs: ['mqls']
  },

  'mqls': {
    inputs: ['leads'],
    outputs: ['sqls', 'cost-per-mql']
  },

  'sqls': {
    inputs: ['mqls'],
    outputs: ['opportunities', 'cost-per-sql']
  },

  'opportunities': {
    inputs: ['sqls'],
    outputs: ['deals-won', 'cost-per-opp']
  },

  'deals-won': {
    inputs: ['opportunities'],
    outputs: ['new-bookings', 'new-customers-added', 'cost-per-won']
  },

  'cost-per-mql': {
    inputs: ['marketing-spend', 'mqls'],
    outputs: []
  },

  'cost-per-sql': {
    inputs: ['marketing-spend', 'sqls'],
    outputs: []
  },

  'cost-per-opp': {
    inputs: ['marketing-spend', 'opportunities'],
    outputs: []
  },

  'cost-per-won': {
    inputs: ['marketing-spend', 'deals-won'],
    outputs: []
  },

  // ============================================================
  // REVENUE LAYER - ARR and retention
  // ============================================================

  'new-bookings': {
    inputs: ['deals-won', 'new-customers-added'],
    outputs: ['net-new-arr', 'quick-ratio']
  },

  'new-customers-added': {
    inputs: ['deals-won'],
    outputs: ['new-bookings', 'ending-customer-count', 'cac-blended']
  },

  'expansion-arr': {
    inputs: [],
    outputs: ['net-new-arr', 'annualized-nrr', 'quick-ratio']
  },

  'churned-arr': {
    inputs: [],
    outputs: ['net-new-arr', 'annualized-grr', 'annualized-nrr', 'quick-ratio']
  },

  'net-new-arr': {
    inputs: ['new-bookings', 'expansion-arr', 'churned-arr'],
    outputs: ['ending-arr', 'magic-number', 'arr-growth-rate', 'burn-multiple']
  },

  'ending-arr': {
    inputs: ['net-new-arr'],
    outputs: ['mrr', 'arr-growth-rate', 'arpa']
  },

  'mrr': {
    inputs: ['ending-arr'],
    outputs: ['gross-profit']
  },

  'annualized-grr': {
    inputs: ['churned-arr'],
    outputs: []
  },

  'annualized-nrr': {
    inputs: ['expansion-arr', 'churned-arr'],
    outputs: []
  },

  'logo-churn-rate': {
    inputs: [],
    outputs: []
  },

  'ending-customer-count': {
    inputs: ['new-customers-added'],
    outputs: ['arpa']
  },

  'arr-growth-rate': {
    inputs: ['net-new-arr', 'ending-arr'],
    outputs: ['rule-of-40']
  },

  // ============================================================
  // OUTCOMES LAYER - Unit economics and financial performance
  // ============================================================

  // Unit Economics
  'arpa': {
    inputs: ['ending-arr', 'ending-customer-count'],
    outputs: ['ltv', 'cac-payback-period']
  },

  'cac-blended': {
    inputs: ['sales-marketing-spend', 'new-customers-added'],
    outputs: ['ltv-cac-ratio', 'cac-payback-period']
  },

  'ltv': {
    inputs: ['arpa'],
    outputs: ['ltv-cac-ratio']
  },

  'ltv-cac-ratio': {
    inputs: ['ltv', 'cac-blended'],
    outputs: []
  },

  'cac-payback-period': {
    inputs: ['cac-blended', 'arpa', 'gross-margin'],
    outputs: []
  },

  // Sales Efficiency
  'magic-number': {
    inputs: ['net-new-arr', 'sales-marketing-spend'],
    outputs: []
  },

  'quick-ratio': {
    inputs: ['new-bookings', 'expansion-arr', 'churned-arr'],
    outputs: []
  },

  // Financial Performance
  'gross-profit': {
    inputs: ['mrr'],
    outputs: ['gross-margin', 'ebitda']
  },

  'gross-margin': {
    inputs: ['gross-profit'],
    outputs: ['cac-payback-period']
  },

  'ebitda': {
    inputs: ['gross-profit'],
    outputs: ['ebitda-margin', 'rule-of-40']
  },

  'ebitda-margin': {
    inputs: ['ebitda'],
    outputs: ['rule-of-40']
  },

  'rule-of-40': {
    inputs: ['arr-growth-rate', 'ebitda-margin', 'ebitda'],
    outputs: []
  },

  'burn-multiple': {
    inputs: ['net-new-arr'],
    outputs: []
  },
};

/**
 * Get the direct (1st degree) connections for a metric
 */
export function getDirectConnections(metricId: string): {
  inputs: string[];
  outputs: string[];
} {
  const relationship = metricsRelationships[metricId];

  if (!relationship) {
    console.warn(`No relationship found for metric: ${metricId}`);
    return { inputs: [], outputs: [] };
  }

  return {
    inputs: relationship.inputs,
    outputs: relationship.outputs,
  };
}

/**
 * Get both direct (1st degree) and secondary (2nd degree) connections
 */
export function getTwoDegreesOfConnections(metricId: string): {
  primary: string[];    // 1st degree
  secondary: string[];  // 2nd degree
} {
  const direct = getDirectConnections(metricId);
  const secondary = new Set<string>();

  // Get 2nd degree inputs (what feeds the inputs)
  direct.inputs.forEach(inputId => {
    const inputRelationship = metricsRelationships[inputId];
    if (inputRelationship) {
      inputRelationship.inputs.forEach(id => secondary.add(id));
    }
  });

  // Get 2nd degree outputs (what the outputs affect)
  direct.outputs.forEach(outputId => {
    const outputRelationship = metricsRelationships[outputId];
    if (outputRelationship) {
      outputRelationship.outputs.forEach(id => secondary.add(id));
    }
  });

  // Remove any metrics that are already in primary connections
  const primarySet = new Set([...direct.inputs, ...direct.outputs]);
  const secondaryFiltered = Array.from(secondary).filter(id => !primarySet.has(id));

  return {
    primary: [...direct.inputs, ...direct.outputs],
    secondary: secondaryFiltered,
  };
}

/**
 * Get the opacity level for a metric based on focus state
 */
export function getMetricOpacity(
  metricId: string,
  focusState: {
    selectedMetricId: string | null;
    primary: string[];
    secondary: string[];
  }
): number {
  if (!focusState.selectedMetricId) {
    return 1.0; // No focus, everything full opacity
  }

  if (metricId === focusState.selectedMetricId) {
    return 1.0; // Selected metric
  }

  if (focusState.primary.includes(metricId)) {
    return 0.8; // 1st degree connection
  }

  if (focusState.secondary.includes(metricId)) {
    return 0.6; // 2nd degree connection
  }

  return 0.2; // Unrelated metric
}

/**
 * Check if a connection line should be visible
 */
export function shouldShowConnection(
  fromId: string,
  toId: string,
  focusState: {
    selectedMetricId: string | null;
    primary: string[];
    secondary: string[];
  }
): boolean {
  if (!focusState.selectedMetricId) {
    return true; // No focus, show all connections
  }

  const allFocused = [
    focusState.selectedMetricId,
    ...focusState.primary,
    ...focusState.secondary,
  ];

  // Show connection if both endpoints are in the focused set
  return allFocused.includes(fromId) && allFocused.includes(toId);
}

/**
 * Get the layer a metric belongs to
 */
export function getMetricLayer(metricId: string): 'activities' | 'acquisition' | 'revenue' | 'outcomes' {
  // Activities layer
  if (['marketing-spend', 'sales-marketing-spend'].includes(metricId)) {
    return 'activities';
  }

  // Acquisition layer
  if ([
    'impressions', 'clicks', 'leads', 'mqls', 'sqls', 'opportunities', 'deals-won',
    'cpm', 'cpc', 'ctr', 'cost-per-mql', 'cost-per-sql', 'cost-per-opp', 'cost-per-won'
  ].includes(metricId)) {
    return 'acquisition';
  }

  // Revenue layer
  if ([
    'new-bookings', 'new-customers-added', 'expansion-arr', 'churned-arr', 'net-new-arr',
    'ending-arr', 'mrr', 'annualized-grr', 'annualized-nrr',
    'logo-churn-rate', 'ending-customer-count', 'arr-growth-rate'
  ].includes(metricId)) {
    return 'revenue';
  }

  // Outcomes layer (default)
  return 'outcomes';
}
