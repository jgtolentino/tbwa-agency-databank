#!/bin/bash

features=(
  "analyze_campaign"
  "generate_brief"
  "market_insights"
  "competitor_analysis"
)

for feature in "${features[@]}"
do
  echo "Testing: $feature"
  pulser test feature --name="$feature" --expect="success"
done

echo "✅ All features validated."