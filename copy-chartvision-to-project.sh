#!/bin/bash

# Script to copy ChartVision files to another Next.js project

if [ -z "$1" ]; then
  echo "Usage: ./copy-chartvision-to-project.sh /path/to/your/nextjs/project"
  exit 1
fi

TARGET_DIR="$1"

# Check if target is a valid Next.js project
if [ ! -f "$TARGET_DIR/package.json" ]; then
  echo "Error: Target directory doesn't appear to be a Next.js project (no package.json found)"
  exit 1
fi

echo "📋 Copying ChartVision files to $TARGET_DIR..."

# Create directories if they don't exist
mkdir -p "$TARGET_DIR/app/chartvision"
mkdir -p "$TARGET_DIR/components/chartvision"

# Copy the files
cp app/chartvision/page.tsx "$TARGET_DIR/app/chartvision/"
cp components/chartvision/SimplifiedDashboards.tsx "$TARGET_DIR/components/chartvision/"

echo "✅ Files copied successfully!"
echo ""
echo "📦 Make sure to install the required dependency in your target project:"
echo "   cd $TARGET_DIR"
echo "   npm install recharts"
echo ""
echo "🌐 Then access your dashboards at:"
echo "   http://localhost:3000/chartvision"
echo ""
echo "🎯 If using TypeScript, you may need to install types:"
echo "   npm install --save-dev @types/recharts"