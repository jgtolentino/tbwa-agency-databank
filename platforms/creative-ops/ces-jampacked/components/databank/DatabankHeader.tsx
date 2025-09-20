import React from 'react';
import { RefreshCw, Download, FileText, FileSpreadsheet } from 'lucide-react';

interface DatabankHeaderProps {
  onRefresh?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export const DatabankHeader: React.FC<DatabankHeaderProps> = ({
  onRefresh,
  onExportPDF,
  onExportExcel
}) => {
  return (
    <div className="bg-tbwa-white border-b border-tbwa-yellow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-3xl font-bold text-tbwa-black">
              Scout Dashboard Transactions
            </h1>
            <p className="mt-1 text-sm text-tbwa-black text-opacity-70">
              Data Dictionary (2025 Draft) - Field Definitions
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-tbwa-black bg-tbwa-white border border-tbwa-yellow rounded-lg hover:bg-tbwa-yellow hover:bg-opacity-10"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            
            {/* Export Dropdown */}
            <div className="relative group">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-tbwa-black bg-tbwa-yellow rounded-lg hover:bg-tbwa-darkYellow focus:outline-none focus:ring-2 focus:ring-tbwa-yellow focus:ring-offset-2">
                <Download className="h-4 w-4" />
                Export Report
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-tbwa-white rounded-lg shadow-lg border border-tbwa-yellow hidden group-hover:block">
                <button
                  onClick={onExportPDF}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-tbwa-black hover:bg-tbwa-yellow hover:bg-opacity-10"
                >
                  <FileText className="h-4 w-4" />
                  Export as PDF
                </button>
                
                <button
                  onClick={onExportExcel}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-tbwa-black hover:bg-tbwa-yellow hover:bg-opacity-10"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};