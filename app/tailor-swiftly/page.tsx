"use client";

import React, { useState } from 'react';
import FeatureArsenal from '@/components/tailor-swiftly/FeatureArsenal';
import TickBoxConfigurator from '@/components/tailor-swiftly/TickBoxConfigurator';
import { Package, Settings, Layers, ChefHat } from 'lucide-react';

export default function TailorSwiftlyPage() {
  const [activeView, setActiveView] = useState<'arsenal' | 'configurator' | 'overview'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Tailor Swiftly</h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Layers className="w-4 h-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveView('arsenal')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'arsenal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Feature Arsenal
              </button>
              <button
                onClick={() => setActiveView('configurator')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'configurator'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChefHat className="w-4 h-4 inline mr-2" />
                Order Sheet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {activeView === 'overview' && (
          <div className="max-w-6xl mx-auto px-4">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Hyper-Customization at Scale
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Turn any product or solution into a client-aligned version using AI-powered 
                  workflow mapping and Ramen Nagi–style tick box configuration.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveView('configurator')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Customizing
                  </button>
                  <button
                    onClick={() => setActiveView('arsenal')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Browse Arsenal
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Feature Harvesting
                </h3>
                <p className="text-gray-600">
                  Automatically extract and catalog features from any dashboard or application
                  into a reusable arsenal.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tick-Box Configuration
                </h3>
                <p className="text-gray-600">
                  Simple order sheet interface inspired by Ramen Nagi - anyone can 
                  customize without code.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Instant Deployment
                </h3>
                <p className="text-gray-600">
                  Export configurations or deploy customized instances in under 1 hour
                  with full documentation.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-blue-100">Dashboards Harvested</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">153</p>
                  <p className="text-blue-100">Features Available</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">&lt;1hr</p>
                  <p className="text-blue-100">Deployment Time</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">∞</p>
                  <p className="text-blue-100">Customizations</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                How Tailor Swiftly Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Upload/Select</h4>
                  <p className="text-sm text-gray-600">
                    Upload client SOP or select from templates
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Configure</h4>
                  <p className="text-sm text-gray-600">
                    Use tick-box UI to select features
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Preview</h4>
                  <p className="text-sm text-gray-600">
                    Live preview with sample data
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <span className="text-2xl font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Deploy</h4>
                  <p className="text-sm text-gray-600">
                    Export config or auto-deploy
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'arsenal' && <FeatureArsenal />}
        {activeView === 'configurator' && <TickBoxConfigurator />}
      </div>
    </div>
  );
}