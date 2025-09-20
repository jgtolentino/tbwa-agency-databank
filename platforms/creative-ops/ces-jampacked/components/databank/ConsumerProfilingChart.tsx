import React, { useState } from 'react';
import { Users, MapPin } from 'lucide-react';

interface ConsumerProfilingChartProps {
  totalCustomers?: number;
  avgAge?: number;
  genderSplit?: { male: number; female: number };
  incomeDistribution?: { high: number; middle: number; low: number };
  urbanRural?: { urban: number; rural: number };
}

export const ConsumerProfilingChart: React.FC<ConsumerProfilingChartProps> = ({
  totalCustomers = 11000,
  avgAge = 32.5,
  genderSplit = { male: 48, female: 52 },
  incomeDistribution = { high: 25, middle: 58, low: 17 },
  urbanRural = { urban: 71, rural: 29 }
}) => {
  const [activeTab, setActiveTab] = useState<'demographics' | 'ageGender' | 'location' | 'behavior'>('demographics');

  const tabs = [
    { key: 'demographics', label: 'Demographics' },
    { key: 'ageGender', label: 'Age & Gender' },
    { key: 'location', label: 'Location' },
    { key: 'behavior', label: 'Segment Behavior' }
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Consumer Profiling</h2>
        <Users className="h-4 w-4 text-gray-400" />
      </div>

      <div className="space-y-4">
        {/* Summary Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-xl font-bold text-gray-900">{totalCustomers.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Avg Age</p>
            <p className="text-xl font-bold text-blue-600">{avgAge}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Gender Split</p>
            <p className="text-xl font-bold text-purple-600">{genderSplit.male}/{genderSplit.female}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="h-64">
          <div className="h-full p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Income Distribution */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Income Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">High Income</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${(incomeDistribution.high / 60) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{incomeDistribution.high}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Middle Income</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-green-600 rounded-full" 
                          style={{ width: `${(incomeDistribution.middle / 60) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{incomeDistribution.middle}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Low Income</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-yellow-600 rounded-full" 
                          style={{ width: `${(incomeDistribution.low / 60) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{incomeDistribution.low}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Urban vs Rural */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Urban vs Rural</h4>
                <div className="flex items-center justify-center h-32">
                  <div className="relative w-32 h-32">
                    {/* Urban Circle (larger) */}
                    <div className="absolute inset-0 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{urbanRural.urban}%</span>
                    </div>
                    {/* Rural Circle (smaller, bottom-right) */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{urbanRural.rural}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span>Urban</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span>Rural</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Insight */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-900">Geographic Insight</p>
              <p className="text-sm text-purple-700">
                Metro Manila accounts for 35% of customers but 45% of revenue, indicating higher purchasing power.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};