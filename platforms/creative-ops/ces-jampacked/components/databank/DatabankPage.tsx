import React, { useCallback } from 'react';
import { DatabankHeader } from './DatabankHeader';
import DataDictionary from './DataDictionary';

interface DatabankPageProps {
  className?: string;
}

export const DatabankPage: React.FC<DatabankPageProps> = ({ className }) => {
  const handleRefresh = useCallback(() => {
    // Refresh data dictionary - could reload field definitions
    console.log('Refreshing data dictionary...');
  }, []);

  const handleExportPDF = useCallback(() => {
    // Export data dictionary as PDF
    console.log('Exporting data dictionary to PDF...');
  }, []);

  const handleExportExcel = useCallback(() => {
    // Export data dictionary as Excel
    console.log('Exporting data dictionary to Excel...');
  }, []);

  return (
    <div className={`w-full ${className || ''}`}>
      {/* Header */}
      <DatabankHeader
        onRefresh={handleRefresh}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      {/* Data Dictionary Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <DataDictionary />
      </div>
    </div>
  );
};