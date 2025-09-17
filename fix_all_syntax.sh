#!/bin/bash

echo "🔧 Fixing all ChartVision syntax errors..."

# Fix all syntax issues in TSX files
find components/chartvision -name "*.tsx" -type f | while read file; do
  echo "Processing: $file"
  
  # Create a temporary file
  tmp_file="${file}.tmp"
  
  # Use sed to fix all issues
  sed -e 's/export const @/export const /g' \
      -e 's/height=\([0-9]*\)/height={\1}/g' \
      -e 's/Header(2)/HeaderTwo/g' \
      -e 's/Header(3)/HeaderThree/g' \
      -e 's/Header(4)/HeaderFour/g' \
      -e 's/Header(5)/HeaderFive/g' \
      -e 's/Header(6)/HeaderSix/g' \
      -e 's/Header(7)/HeaderSeven/g' \
      -e 's/I-Info/IInfo/g' \
      -e 's/I-LinkedIn/ILinkedIn/g' \
      -e 's/I-Twitter/ITwitter/g' \
      -e 's/Map-Color/MapColor/g' \
      -e 's/MonthlySalesTrend-Category/MonthlySalesTrendCategory/g' \
      -e 's/MonthlySalesTrend-Region/MonthlySalesTrendRegion/g' \
      -e 's/OrderDetails|Show\/Hide/OrderDetailsShowHide/g' \
      -e 's/SalesbyCity-Tooltip/SalesbyCityTooltip/g' \
      -e 's/SalesbyState-Map/SalesbyStateMap/g' \
      -e 's/SalesbySub-Category/SalesbySubCategory/g' \
      -e 's/TopSalesbyState-KPI/TopSalesbyStateKPI/g' \
      -e 's/TopSoldProducts-Tooltip/TopSoldProductsTooltip/g' \
      -e 's/WeeklySalesTrend-Header/WeeklySalesTrendHeader/g' \
      -e 's/YOY%-Region/YOYRegion/g' \
      -e 's/YOY%-Category/YOYCategory/g' \
      -e 's/YOY%-Segment/YOYSegment/g' \
      -e 's/YOY%-TopStates/YOYTopStates/g' \
      -e 's/YearFilter-Buttons/YearFilterButtons/g' \
      -e 's/SampleSuperstore-SalesPerformance_VOTD/SampleSuperstoreSalesPerformanceVOTD/g' \
      -e 's/VGContest_SuperSampleSuperstore_RyanSleeper/VGContestSuperSampleSuperstoreRyanSleeper/g' \
      -e 's/WebTrafficDashboard_DigitalMarketing_VOTD/WebTrafficDashboardDigitalMarketingVOTD/g' \
      -e 's/(HeatMap)/HeatMap/g' \
      -e 's/(Indicator)/Indicator/g' \
      -e 's/useSampleSuperstore-SalesPerformance_VOTDData/useSampleSuperstoreSalesPerformanceVOTDData/g' \
      "$file" > "$tmp_file"
  
  # Replace original file
  mv "$tmp_file" "$file"
done

# Fix PostCSS config if needed
if [ ! -f postcss.config.js ]; then
  echo "module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }" > postcss.config.js
fi

echo "✅ All syntax errors fixed!"