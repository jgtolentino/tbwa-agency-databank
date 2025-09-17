"use client";

import React, { useState } from 'react';
import {
  ChefHat,
  Check,
  X,
  Plus,
  Minus,
  Info,
  ShoppingCart,
  Sparkles,
  Download,
  Send,
  Clock,
  Users,
  Shield,
  Palette,
  Globe,
  Zap
} from 'lucide-react';

// Ramen Nagi-style configuration interface
interface ConfigOption {
  id: string;
  category: string;
  label: string;
  description?: string;
  price?: number;
  type: 'checkbox' | 'radio' | 'counter' | 'select';
  options?: string[];
  max?: number;
  min?: number;
  default?: any;
  icon?: React.ReactNode;
  premium?: boolean;
}

interface ConfigSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  options: ConfigOption[];
}

// Configuration sections inspired by Ramen Nagi order sheet
const configSections: ConfigSection[] = [
  {
    title: "Base Dashboard Type",
    icon: <ChefHat className="w-5 h-5" />,
    description: "Choose your foundation",
    options: [
      {
        id: "base_analytics",
        category: "base",
        label: "Analytics Dashboard",
        type: "radio",
        default: true,
        icon: <Sparkles className="w-4 h-4" />
      },
      {
        id: "base_operational",
        category: "base",
        label: "Operational Dashboard",
        type: "radio",
        icon: <Clock className="w-4 h-4" />
      },
      {
        id: "base_executive",
        category: "base",
        label: "Executive Dashboard",
        type: "radio",
        icon: <Shield className="w-4 h-4" />,
        premium: true
      }
    ]
  },
  {
    title: "Data Visualizations",
    icon: <Palette className="w-5 h-5" />,
    description: "Select your charts (tick all that apply)",
    options: [
      {
        id: "viz_line_charts",
        category: "viz",
        label: "Time Series Charts",
        description: "Line, area, sparklines",
        type: "checkbox",
        default: true,
        price: 0
      },
      {
        id: "viz_bar_charts",
        category: "viz",
        label: "Comparison Charts",
        description: "Bar, column, waterfall",
        type: "checkbox",
        default: true,
        price: 0
      },
      {
        id: "viz_geo_maps",
        category: "viz",
        label: "Geographic Maps",
        description: "Heatmaps, choropleth, markers",
        type: "checkbox",
        price: 50,
        premium: true
      },
      {
        id: "viz_advanced",
        category: "viz",
        label: "Advanced Analytics",
        description: "Sankey, treemap, network",
        type: "checkbox",
        price: 100,
        premium: true
      }
    ]
  },
  {
    title: "Features & Capabilities",
    icon: <Zap className="w-5 h-5" />,
    description: "Enhance your dashboard",
    options: [
      {
        id: "feature_realtime",
        category: "features",
        label: "Real-time Updates",
        type: "checkbox",
        price: 75
      },
      {
        id: "feature_export",
        category: "features",
        label: "Export to PDF/Excel",
        type: "checkbox",
        default: true,
        price: 0
      },
      {
        id: "feature_alerts",
        category: "features",
        label: "Smart Alerts",
        description: "Threshold & anomaly detection",
        type: "checkbox",
        price: 50
      },
      {
        id: "feature_ai_insights",
        category: "features",
        label: "AI-Powered Insights",
        type: "checkbox",
        price: 150,
        premium: true
      }
    ]
  },
  {
    title: "User Access",
    icon: <Users className="w-5 h-5" />,
    description: "How many users?",
    options: [
      {
        id: "users_count",
        category: "users",
        label: "Number of Users",
        type: "counter",
        min: 1,
        max: 100,
        default: 5,
        price: 10 // per user
      },
      {
        id: "users_sso",
        category: "users",
        label: "Single Sign-On (SSO)",
        type: "checkbox",
        price: 100
      },
      {
        id: "users_roles",
        category: "users",
        label: "Role-Based Access",
        type: "checkbox",
        default: true,
        price: 0
      }
    ]
  },
  {
    title: "Branding & Theme",
    icon: <Globe className="w-5 h-5" />,
    description: "Make it yours",
    options: [
      {
        id: "brand_colors",
        category: "brand",
        label: "Custom Color Scheme",
        type: "checkbox",
        default: true,
        price: 0
      },
      {
        id: "brand_logo",
        category: "brand",
        label: "Custom Logo",
        type: "checkbox",
        default: true,
        price: 0
      },
      {
        id: "brand_domain",
        category: "brand",
        label: "Custom Domain",
        description: "yourdashboard.com",
        type: "checkbox",
        price: 50
      },
      {
        id: "brand_whitelabel",
        category: "brand",
        label: "Complete White Label",
        type: "checkbox",
        price: 200,
        premium: true
      }
    ]
  }
];

const TickBoxConfigurator: React.FC = () => {
  const [selections, setSelections] = useState<Record<string, any>>({
    base_analytics: true,
    viz_line_charts: true,
    viz_bar_charts: true,
    feature_export: true,
    users_count: 5,
    users_roles: true,
    brand_colors: true,
    brand_logo: true
  });

  const handleToggle = (optionId: string, value: any) => {
    setSelections(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleRadioChange = (category: string, optionId: string) => {
    // Clear other radio options in the same category
    const newSelections = { ...selections };
    configSections.forEach(section => {
      section.options.forEach(opt => {
        if (opt.category === category && opt.type === 'radio') {
          newSelections[opt.id] = false;
        }
      });
    });
    newSelections[optionId] = true;
    setSelections(newSelections);
  };

  const calculateTotal = () => {
    let total = 299; // Base price
    configSections.forEach(section => {
      section.options.forEach(opt => {
        if (selections[opt.id] && opt.price) {
          if (opt.type === 'counter') {
            total += opt.price * (selections[opt.id] || 0);
          } else {
            total += opt.price;
          }
        }
      });
    });
    return total;
  };

  const exportOrder = () => {
    const order = {
      timestamp: new Date().toISOString(),
      selections: selections,
      total: calculateTotal(),
      configuration: configSections.map(section => ({
        section: section.title,
        selected: section.options
          .filter(opt => selections[opt.id])
          .map(opt => ({
            id: opt.id,
            label: opt.label,
            value: selections[opt.id]
          }))
      }))
    };
    
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-order.json';
    a.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Configuration Order Sheet
        </h1>
        <p className="text-gray-600">
          Customize your perfect dashboard - Ramen Nagi style! ✓
        </p>
      </div>

      {/* Order Sheet */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-900">
        {/* Sheet Header */}
        <div className="bg-gray-900 text-white p-4 text-center">
          <h2 className="text-xl font-bold">TAILOR SWIFTLY ORDER FORM</h2>
          <p className="text-sm opacity-90 mt-1">Please tick (✓) your selections</p>
        </div>

        {/* Configuration Sections */}
        <div className="p-6 space-y-8">
          {configSections.map((section, sectionIdx) => (
            <div key={section.title} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.options.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 transition-all cursor-pointer ${
                      selections[option.id] 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${option.premium ? 'relative overflow-hidden' : ''}`}
                    onClick={() => {
                      if (option.type === 'checkbox') {
                        handleToggle(option.id, !selections[option.id]);
                      } else if (option.type === 'radio') {
                        handleRadioChange(option.category, option.id);
                      }
                    }}
                  >
                    {option.premium && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                        PREMIUM
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Checkbox/Radio */}
                      {option.type === 'checkbox' && (
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selections[option.id] 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {selections[option.id] && <Check className="w-4 h-4 text-white" />}
                        </div>
                      )}
                      
                      {option.type === 'radio' && (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selections[option.id] 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {selections[option.id] && <div className="w-3 h-3 bg-white rounded-full" />}
                        </div>
                      )}

                      {/* Counter */}
                      {option.type === 'counter' && (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggle(option.id, Math.max((selections[option.id] || 0) - 1, option.min || 0))}
                            className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold">{selections[option.id] || 0}</span>
                          <button
                            onClick={() => handleToggle(option.id, Math.min((selections[option.id] || 0) + 1, option.max || 100))}
                            className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Label and Description */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span className="font-medium text-gray-900">{option.label}</span>
                          {option.price !== undefined && option.price > 0 && (
                            <span className="text-sm text-gray-500">
                              +${option.price}{option.type === 'counter' ? '/user' : ''}
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 border-t-2 border-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Order Summary</h3>
              <p className="text-sm text-gray-600">
                {Object.values(selections).filter(v => v === true || typeof v === 'number').length} items selected
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">${calculateTotal()}/mo</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportOrder}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Configuration
            </button>
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Deploy Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Select your base dashboard type and features</li>
              <li>Your configuration is instantly saved and versioned</li>
              <li>AI agents will build your custom dashboard in under 1 hour</li>
              <li>All features can be modified after deployment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickBoxConfigurator;