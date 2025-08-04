"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Import simplified dashboards
import {
  WebTrafficSimplified,
  SuperstoreSimplified,
  SampleSuperstoreSimplified,
  VGContestSimplified
} from '@/components/chartvision/SimplifiedDashboards';

// Import metadata viewer
import DashboardMetadataViewer from '@/components/chartvision/DashboardMetadataViewer';

export default function ChartVisionGallery() {
  const [activeView, setActiveView] = useState<'gallery' | 'metadata'>('gallery');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ChartVision Dashboard Gallery</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('gallery')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'gallery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Dashboard Gallery
            </button>
            <button
              onClick={() => setActiveView('metadata')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'metadata'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Extraction Metadata
            </button>
          </div>
        </div>
        
        {activeView === 'gallery' ? (
          <div className="space-y-12">
            {/* Web Traffic Dashboard */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Web Traffic Dashboard</h2>
              <WebTrafficSimplified />
            </section>

            {/* Superstore Dashboard */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Superstore Dashboard</h2>
              <SuperstoreSimplified />
            </section>

            {/* Sample Superstore Dashboard */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sample Superstore - Sales Performance</h2>
              <SampleSuperstoreSimplified />
            </section>

            {/* VG Contest Dashboard */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">VG Contest - Ryan Sleeper</h2>
              <VGContestSimplified />
            </section>
          </div>
        ) : (
          <DashboardMetadataViewer />
        )}
      </div>
    </div>
  );
}