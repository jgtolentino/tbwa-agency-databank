import React from 'react';
import { DatabankPage } from './DatabankPage';

/**
 * Example usage of the Databank page component
 * 
 * This component demonstrates how to integrate the extracted Scout Analytics
 * databank components into an Amazon-styled dashboard.
 */
export const DatabankExample: React.FC = () => {
  return (
    <div className="w-full">
      {/* 
        The DatabankPage component includes:
        - Header with title and export functionality
        - Filter controls (date, location, category, brand)
        - Transaction trends chart with area chart visualization
        - Product mix chart with pie chart and SKU metrics
        - Consumer behavior funnel chart
        - Consumer profiling with demographics
        - Comparative analytics metrics
      */}
      <DatabankPage />
    </div>
  );
};

export default DatabankExample;