#!/bin/bash

# Example: Convert Figma Data Visualization Kit to React Components
# URL: https://www.figma.com/design/MxZzjY9lcdl9sYERJfAFYN/r19-Data-Visualization-Kit--Community-

echo "🎨 DashMorph: Converting Figma Data Visualization Kit to React"

# Set your Figma access token
export FIGMA_ACCESS_TOKEN="your-figma-token-here"

# Extract and analyze the visualization kit
echo "📊 Step 1: Analyzing Figma components..."
dashmorph extract \
  -s "https://www.figma.com/design/MxZzjY9lcdl9sYERJfAFYN/r19-Data-Visualization-Kit--Community-" \
  -o "./analysis/visualization-kit.json" \
  --figma-token $FIGMA_ACCESS_TOKEN

# Convert to React components with comprehensive setup
echo "⚛️ Step 2: Generating React components..."
dashmorph morph \
  -s "https://www.figma.com/design/MxZzjY9lcdl9sYERJfAFYN/r19-Data-Visualization-Kit--Community-" \
  -t react \
  -o "./generated/visualization-components" \
  --styling tailwind \
  --charts recharts \
  --typescript \
  --tests \
  --stories \
  --validate \
  --threshold 95 \
  --figma-token $FIGMA_ACCESS_TOKEN

# Start preview server
echo "🚀 Step 3: Starting preview server..."
dashmorph preview -d "./generated/visualization-components" -p 3001

echo "✅ Complete! Your Figma visualization kit is now available as:"
echo "   📁 React Components: ./generated/visualization-components/src/components/"
echo "   🎨 Design System: ./generated/visualization-components/src/styles/design-system.ts"
echo "   🧪 Tests: ./generated/visualization-components/src/__tests__/"
echo "   📚 Stories: ./generated/visualization-components/src/stories/"
echo "   🌐 Preview: http://localhost:3001"