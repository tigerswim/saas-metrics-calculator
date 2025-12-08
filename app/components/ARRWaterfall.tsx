'use client';

interface ARRWaterfallProps {
  beginningARR: number; // in $M
  newBookings: number; // in $K
  expansion: number; // in $K
  churn: number; // in $K
  endingARR: number; // in $M
}

interface WaterfallBar {
  label: string;
  value: number; // in $M (height of bar)
  displayValue: string;
  baseValue: number; // where bar starts (bottom position)
  isNegative: boolean;
  color: string;
  isTotal: boolean;
}

export default function ARRWaterfall({ beginningARR, newBookings, expansion, churn, endingARR }: ARRWaterfallProps) {
  // Convert to millions for consistent display
  const newM = newBookings / 1000;
  const expansionM = expansion / 1000;
  const churnM = churn / 1000;

  // Calculate positions for true waterfall
  const bars: WaterfallBar[] = [
    {
      label: 'Beginning ARR',
      value: beginningARR,
      displayValue: `$${beginningARR.toFixed(1)}M`,
      baseValue: 0, // Total bar starts from 0
      isNegative: false,
      color: 'bg-slate-400',
      isTotal: true,
    },
    {
      label: 'New Bookings',
      value: newM,
      displayValue: `+$${newM.toFixed(1)}M`,
      baseValue: beginningARR,
      isNegative: false,
      color: 'bg-green-500',
      isTotal: false,
    },
    {
      label: 'Expansion',
      value: expansionM,
      displayValue: `+$${expansionM.toFixed(1)}M`,
      baseValue: beginningARR + newM,
      isNegative: false,
      color: 'bg-blue-500',
      isTotal: false,
    },
    {
      label: 'Churn',
      value: churnM,
      displayValue: `-$${churnM.toFixed(1)}M`,
      baseValue: beginningARR + newM + expansionM - churnM,
      isNegative: true,
      color: 'bg-red-500',
      isTotal: false,
    },
    {
      label: 'Ending ARR',
      value: endingARR,
      displayValue: `$${endingARR.toFixed(1)}M`,
      baseValue: 0, // Total bar starts from 0
      isNegative: false,
      color: 'bg-purple-600',
      isTotal: true,
    },
  ];

  // Find min and max values for scaling
  const minValue = 125; // Start at $125M
  const maxValue = Math.max(
    beginningARR,
    beginningARR + newM,
    beginningARR + newM + expansionM,
    endingARR
  ) * 1.05; // Add 5% padding

  const valueRange = maxValue - minValue;

  // Convert a value to percentage of chart height
  const valueToPercent = (value: number) => {
    return ((value - minValue) / valueRange) * 100;
  };

  // Get height as percentage
  const getHeightPercent = (value: number) => {
    return (value / valueRange) * 100;
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h4 className="text-sm font-semibold text-slate-700 mb-6">Monthly ARR Movement</h4>

      {/* Waterfall Chart */}
      <div className="relative h-48 mb-16">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-slate-500">
          <span>${maxValue.toFixed(0)}M</span>
          <span>${(minValue + valueRange * 0.75).toFixed(0)}M</span>
          <span>${(minValue + valueRange * 0.5).toFixed(0)}M</span>
          <span>${(minValue + valueRange * 0.25).toFixed(0)}M</span>
          <span>${minValue}M</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-12 right-0 top-0 bottom-0">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-slate-100" />
            ))}
          </div>

          {/* Bars container */}
          <div className="absolute inset-0 flex items-end justify-around px-4">
            {bars.map((bar, index) => {
              const prevBar = index > 0 ? bars[index - 1] : null;

              // For total bars (beginning/ending), they extend from minValue to their value
              // For floating bars, they show just the increment
              const barBottom = bar.isTotal
                ? 0
                : valueToPercent(bar.baseValue);

              const barHeight = bar.isTotal
                ? valueToPercent(bar.value)
                : getHeightPercent(bar.value);

              // Calculate connector line position
              let connectorBottom = 0;
              let connectorLeft = '-50%';

              if (prevBar && !bar.isTotal) {
                if (bar.isNegative) {
                  // For churn, connect from top of previous to top of current
                  connectorBottom = valueToPercent(bar.baseValue + bar.value);
                } else {
                  // For positive bars, connect from top of previous to bottom of current
                  connectorBottom = valueToPercent(bar.baseValue);
                }
              }

              return (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col items-center justify-end h-full max-w-[80px] relative"
                >
                  {/* Connector line (for floating bars) */}
                  {prevBar && !bar.isTotal && (
                    <div
                      className="absolute w-full border-t-2 border-dashed border-slate-300 z-0"
                      style={{
                        bottom: `${connectorBottom}%`,
                        left: connectorLeft,
                        width: '50%',
                      }}
                    />
                  )}

                  {/* Bar */}
                  <div
                    className="w-full absolute transition-all duration-500 rounded-t-lg"
                    style={{
                      height: `${barHeight}%`,
                      bottom: `${barBottom}%`,
                    }}
                  >
                    <div className={`w-full h-full ${bar.color} rounded-t-lg relative group shadow-sm hover:shadow-md transition-shadow`}>
                      {/* Value label inside bar (on hover) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.displayValue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Label and value below */}
                  <div className="absolute text-center" style={{ top: '100%', marginTop: '8px' }}>
                    <div className={`text-sm font-semibold whitespace-nowrap ${
                      bar.isNegative ? 'text-red-600' :
                      index === 0 ? 'text-slate-600' :
                      index === bars.length - 1 ? 'text-purple-600' :
                      index === 1 ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {bar.displayValue}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {bar.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
