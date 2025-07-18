#!/bin/bash

# Pulser CES Examples
echo "🎨 Pulser CES Example Commands"
echo "=============================="
echo ""

# Example 1: Basic color search
echo "1. Find pink-dominant campaigns:"
echo '   :ces "pink dominant TikTok spots 2024"'
echo ""

# Example 2: Pantone matching
echo "2. Match specific Pantone colors:"
echo '   :ces "campaigns matching Pantone 13-1520 Peach Fuzz"'
echo ""

# Example 3: Industry-specific queries
echo "3. Industry + color queries:"
echo '   :ces "automotive ads with warm earthy tones Q3 2024"'
echo ""

# Example 4: Palette scoring
echo "4. Score a specific image:"
echo '   :ces!palette_score {"image_url":"https://example.com/ad.jpg"}'
echo ""

# Example 5: Find similar creatives
echo "5. Find visually similar campaigns:"
echo '   :ces!search_similar {"image_url":"https://example.com/reference.jpg","limit":5}'
echo ""

# Example 6: Complex multi-criteria
echo "6. Complex color criteria:"
echo '   :ces "campaigns with >70% warm colors, <30% cool colors, featuring orange accents"'
echo ""

# Example 7: Brand-specific search
echo "7. Brand + palette search:"
echo '   :ces "Nike campaigns with vibrant neon palettes 2023-2024"'
echo ""

# Example 8: Seasonal palettes
echo "8. Seasonal color trends:"
echo '   :ces "holiday campaigns with traditional red and green palettes"'
echo ""

# Example 9: Complementary colors
echo "9. Color harmony search:"
echo '   :ces "campaigns using complementary color schemes with high contrast"'
echo ""

# Example 10: Export friendly format
echo "10. Export results as JSON:"
echo '    :ces "top 5 blue campaigns" | jq .results'
echo ""

echo "💡 Pro Tips:"
echo "- Use quotes around complex queries"
echo "- Add | jq for pretty JSON output"
echo "- Use !tool_name to specify exact tool"
echo "- Combine with grep/awk for filtering"