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
    <div className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Scout Databank Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Executive Analytics & Insights Platform
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            
            {/* Export Dropdown */}
            <div className="relative group">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Download className="h-4 w-4" />
                Export Report
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                <button
                  onClick={onExportPDF}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4" />
                  Export as PDF
                </button>
                
                <button
                  onClick={onExportExcel}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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