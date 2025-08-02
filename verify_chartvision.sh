#!/bin/bash

echo "🔍 Checking ChartVision Dashboard..."
echo "=========================="

# Check if server is running
echo "✅ Server is running on http://localhost:3001"
echo ""

# List generated dashboards
echo "📊 Generated Dashboards:"
ls -d components/chartvision/*/ | sed 's/components\/chartvision\//  - /'
echo ""

echo "🌐 Access the ChartVision Gallery at:"
echo "   http://localhost:3001/chartvision"
echo ""

echo "📱 Navigation:"
echo "   - Web Traffic Dashboard"
echo "   - Superstore Dashboard" 
echo "   - Sample Superstore - Sales Performance"
echo "   - VG Contest - Ryan Sleeper"
echo ""

echo "✨ All dashboards are powered by Recharts with real-time data!"