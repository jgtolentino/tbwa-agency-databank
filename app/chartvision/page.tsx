"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Import simplified dashboards
import {
  WebTrafficSimplified,
  SuperstoreSimplified,
  SampleSuperstoreSimplified,
  VGContestSimplified
} from '@/components/chartvision/SimplifiedDashboards';

export default function ChartVisionGallery() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ChartVision Dashboard Gallery</h1>
        
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
      </div>
    </div>
  );
}