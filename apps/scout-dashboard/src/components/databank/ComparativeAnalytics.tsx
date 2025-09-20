import React from 'react';

interface ComparativeAnalyticsProps {
  periodGrowth?: number;
  forecastAccuracy?: number;
  marketShare?: number;
}

export const ComparativeAnalytics: React.FC<ComparativeAnalyticsProps> = ({
  periodGrowth = 12.5,
  forecastAccuracy = 94.2,
  marketShare = 28.7
}) => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparative Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Period-over-Period Growth</p>
          <p className="text-2xl font-bold text-green-600 mt-1">+{periodGrowth}%</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">Forecast Accuracy</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{forecastAccuracy}%</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">Market Share</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{marketShare}%</p>
        </div>
      </div>
    </div>
  );
};