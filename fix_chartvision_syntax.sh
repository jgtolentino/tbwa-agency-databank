#!/bin/bash

echo "🔧 Fixing ChartVision syntax errors..."

# Fix component names starting with @
find components/chartvision -name "*.tsx" -type f -exec sed -i '' 's/export const @/export const /g' {} \;

# Fix missing quotes around height values
find components/chartvision -name "*.tsx" -type f -exec sed -i '' 's/height=\([0-9]*\)/height={\1}/g' {} \;

# Fix bracket notation in dataKey attributes (escape special characters)
find components/chartvision -name "*.tsx" -type f -exec sed -i '' 's/dataKey="\[/dataKey="/g' {} \;
find components/chartvision -name "*.tsx" -type f -exec sed -i '' 's/\]"/"/g' {} \;

echo "✅ Syntax errors fixed!"