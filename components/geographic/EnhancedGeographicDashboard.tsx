"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Map, 
  Layers, 
  Filter, 
  Download, 
  ZoomIn, 
  ZoomOut,
  Navigation,
  Palette,
  BarChart3,
  TrendingUp,
  Info,
  Settings,
  Globe,
  MapPin,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';

// Types for geographic data
interface GeoFeature {
  type: string;
  geometry: any;
  properties: {
    name: string;
    value: number;
    population?: number;
    density?: number;
    growth?: number;
    [key: string]: any;
  };
}

interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'choropleth' | 'heatmap' | 'points' | 'flow' | 'hexbin';
  data?: any;
  style?: any;
}

interface ColorScheme {
  name: string;
  colors: string[];
  type: 'sequential' | 'diverging' | 'categorical';
}

// Enhanced color schemes
const colorSchemes: Record<string, ColorScheme> = {
  blues: {
    name: 'Blues',
    colors: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    type: 'sequential'
  },
  redBlue: {
    name: 'Red-Blue',
    colors: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
    type: 'diverging'
  },
  viridis: {
    name: 'Viridis',
    colors: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],
    type: 'sequential'
  },
  spectral: {
    name: 'Spectral',
    colors: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
    type: 'diverging'
  }
};

// Mock data generator
const generateMockGeoData = () => {
  // This would normally come from PostGIS
  const states = [
    { name: 'California', lat: 36.7783, lng: -119.4179, value: 89432, growth: 12.3 },
    { name: 'Texas', lat: 31.9686, lng: -99.9018, value: 76543, growth: 8.7 },
    { name: 'Florida', lat: 27.6648, lng: -81.5158, value: 65432, growth: 15.2 },
    { name: 'New York', lat: 40.7128, lng: -74.0060, value: 78901, growth: -2.1 },
    { name: 'Illinois', lat: 40.6331, lng: -89.3985, value: 54321, growth: 4.5 },
  ];
  
  return states;
};

const EnhancedGeographicDashboard: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMetric, setSelectedMetric] = useState<'value' | 'growth'>('value');
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>('blues');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'choropleth', name: 'Choropleth Map', visible: true, type: 'choropleth' },
    { id: 'heatmap', name: 'Heat Map', visible: false, type: 'heatmap' },
    { id: 'points', name: 'Point Markers', visible: false, type: 'points' },
    { id: 'flow', name: 'Flow Lines', visible: false, type: 'flow' }
  ]);
  const [showLegend, setShowLegend] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  // Initialize D3 map
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear previous map
    d3.select(mapRef.current).selectAll('*').remove();
    
    const width = mapRef.current.clientWidth;
    const height = 500;
    
    const svg = d3.select(mapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
    
    // Add map background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f0f4f8');
    
    // Create map group for zoom/pan
    const mapGroup = svg.append('g');
    
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        mapGroup.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });
    
    svg.call(zoom as any);
    
    // Render active layers
    const geoData = generateMockGeoData();
    
    layers.forEach(layer => {
      if (!layer.visible) return;
      
      switch (layer.type) {
        case 'choropleth':
          renderChoropleth(mapGroup, geoData, width, height);
          break;
        case 'points':
          renderPoints(mapGroup, geoData, width, height);
          break;
        case 'heatmap':
          renderHeatmap(mapGroup, geoData, width, height);
          break;
      }
    });
    
    // Add legend if enabled
    if (showLegend) {
      renderLegend(svg, width, height);
    }
    
  }, [layers, selectedMetric, selectedColorScheme, showLegend]);
  
  const renderChoropleth = (group: any, data: any[], width: number, height: number) => {
    const colorScale = d3.scaleQuantize()
      .domain(d3.extent(data, d => selectedMetric === 'value' ? d.value : d.growth) as [number, number])
      .range(colorSchemes[selectedColorScheme].colors);
    
    // Simulate state boundaries (normally from GeoJSON)
    const stateGroup = group.append('g').attr('class', 'states');
    
    data.forEach((state, i) => {
      const x = (state.lng + 125) * (width / 60);
      const y = (50 - state.lat) * (height / 30);
      const size = Math.sqrt(state.value / 1000) * 10;
      
      stateGroup.append('rect')
        .attr('x', x - size/2)
        .attr('y', y - size/2)
        .attr('width', size)
        .attr('height', size)
        .attr('fill', colorScale(selectedMetric === 'value' ? state.value : state.growth))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('rx', 2)
        .on('mouseover', function(event: any) {
          d3.select(this).attr('stroke', '#000').attr('stroke-width', 2);
          
          // Tooltip
          const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
          
          tooltip.html(`
            <strong>${state.name}</strong><br/>
            Value: ${state.value.toLocaleString()}<br/>
            Growth: ${state.growth > 0 ? '+' : ''}${state.growth}%
          `);
        })
        .on('mouseout', function() {
          d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1);
          d3.selectAll('.tooltip').remove();
        });
    });
  };
  
  const renderPoints = (group: any, data: any[], width: number, height: number) => {
    const pointGroup = group.append('g').attr('class', 'points');
    
    data.forEach(point => {
      const x = (point.lng + 125) * (width / 60);
      const y = (50 - point.lat) * (height / 30);
      
      pointGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', Math.sqrt(point.value / 5000) * 5)
        .attr('fill', '#e74c3c')
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#c0392b')
        .attr('stroke-width', 2);
    });
  };
  
  const renderHeatmap = (group: any, data: any[], width: number, height: number) => {
    // Simplified heatmap visualization
    const heatmapGroup = group.append('g').attr('class', 'heatmap');
    
    data.forEach(point => {
      const x = (point.lng + 125) * (width / 60);
      const y = (50 - point.lat) * (height / 30);
      
      const gradient = heatmapGroup.append('radialGradient')
        .attr('id', `heat-${point.name}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ff0000')
        .attr('stop-opacity', 0.8);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#ff0000')
        .attr('stop-opacity', 0);
      
      heatmapGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', Math.sqrt(point.value / 1000) * 15)
        .attr('fill', `url(#heat-${point.name})`);
    });
  };
  
  const renderLegend = (svg: any, width: number, height: number) => {
    const legendGroup = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 150}, 20)`);
    
    const scheme = colorSchemes[selectedColorScheme];
    const legendHeight = 200;
    const legendWidth = 20;
    
    // Create gradient
    const gradient = legendGroup.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    
    scheme.colors.forEach((color, i) => {
      gradient.append('stop')
        .attr('offset', `${(i / (scheme.colors.length - 1)) * 100}%`)
        .attr('stop-color', color);
    });
    
    // Legend rectangle
    legendGroup.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', 'url(#legend-gradient)')
      .attr('stroke', '#ccc');
    
    // Legend labels
    const data = generateMockGeoData();
    const extent = d3.extent(data, d => selectedMetric === 'value' ? d.value : d.growth) as [number, number];
    
    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', 10)
      .attr('font-size', '12px')
      .text(extent[1].toLocaleString());
    
    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', legendHeight)
      .attr('font-size', '12px')
      .text(extent[0].toLocaleString());
  };
  
  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };
  
  const exportMap = () => {
    // Export SVG as image
    const svg = mapRef.current?.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'geographic-dashboard.png';
          a.click();
        }
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Enhanced Geographic Dashboard</h2>
              <p className="text-gray-600">Production-grade mapping with PostGIS & D3.js</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showControls ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={exportMap}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Metric Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as 'value' | 'growth')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="value">Absolute Value</option>
                <option value="growth">Growth Rate</option>
              </select>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <select
                value={selectedColorScheme}
                onChange={(e) => setSelectedColorScheme(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <option key={key} value={key}>{scheme.name}</option>
                ))}
              </select>
            </div>

            {/* Layer Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Layers
              </label>
              <div className="space-y-1">
                {layers.map(layer => (
                  <label key={layer.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => toggleLayer(layer.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{layer.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Legend Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Options
              </label>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showLegend}
                    onChange={() => setShowLegend(!showLegend)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Show Legend</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-[500px] bg-gray-100" />
        
        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button
            onClick={() => {
              const svg = d3.select(mapRef.current).select('svg');
              svg.transition().call(
                d3.zoom().transform as any,
                d3.zoomIdentity.scale(zoomLevel * 1.2)
              );
            }}
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              const svg = d3.select(mapRef.current).select('svg');
              svg.transition().call(
                d3.zoom().transform as any,
                d3.zoomIdentity.scale(zoomLevel * 0.8)
              );
            }}
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              const svg = d3.select(mapRef.current).select('svg');
              svg.transition().call(
                d3.zoom().transform as any,
                d3.zoomIdentity
              );
            }}
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>
        
        {/* Info Panel */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Regions</p>
            <p className="text-xl font-bold text-gray-900">5</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Highest Value</p>
            <p className="text-xl font-bold text-green-600">89,432</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Growth</p>
            <p className="text-xl font-bold text-blue-600">+7.7%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Data Points</p>
            <p className="text-xl font-bold text-gray-900">1,247</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGeographicDashboard;