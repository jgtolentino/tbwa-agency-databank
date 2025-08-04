"use client";

import React, { useState } from 'react';
import EnhancedGeographicDashboard from '@/components/geographic/EnhancedGeographicDashboard';
import GeographicImprovements from '@/components/geographic/GeographicImprovements';
import { Map, Settings, TrendingUp } from 'lucide-react';

export default function GeographicDashboardPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'improvements'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Geographic Intelligence Platform</h1>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Map className="w-4 h-4" />
                Live Dashboard
              </button>
              <button
                onClick={() => setActiveView('improvements')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'improvements'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Improvement Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-4">
        {activeView === 'dashboard' ? (
          <div className="max-w-7xl mx-auto">
            <EnhancedGeographicDashboard />
            
            {/* Additional Features Preview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Render Time</span>
                    <span className="font-medium text-green-600">45ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Data Points</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frame Rate</span>
                    <span className="font-medium text-green-600">60 FPS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-medium">124 MB</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Data Sources</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">PostGIS Database</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Census API</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Weather Service</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Traffic Data</span>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-gray-900">Region analysis completed</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-gray-900">Heat map layer updated</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-gray-900">New data points added</p>
                      <p className="text-xs text-gray-500">12 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <GeographicImprovements />
        )}
      </div>
    </div>
  );
}