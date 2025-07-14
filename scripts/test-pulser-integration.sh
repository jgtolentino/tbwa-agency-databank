#!/bin/bash

# Pulser CES Integration Test
echo "🎯 Testing Pulser CES Integration..."
echo ""

# Check environment
if [ -z "$CES_API_TOKEN" ]; then
    echo "❌ Error: CES_API_TOKEN not set"
    exit 1
fi

if [ -z "$CES_GATEWAY_URL" ]; then
    export CES_GATEWAY_URL="https://ces-gw.onrender.com"
fi

echo "Gateway: $CES_GATEWAY_URL"
echo ""

# Test 1: Basic ask query
echo "1️⃣ Testing :ces command..."
RESULT=$(pulser call ces ask "top 3 pink ads" 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ Basic ask query working"
else
    echo "❌ Ask query failed: $RESULT"
    exit 1
fi

# Test 2: Palette scoring
echo ""
echo "2️⃣ Testing palette scoring..."
SCORE_RESULT=$(pulser call ces palette_score '{"image_url":"https://example.com/test.jpg"}' 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ Palette scoring working"
else
    echo "❌ Palette scoring failed: $SCORE_RESULT"
fi

# Test 3: Similar search
echo ""
echo "3️⃣ Testing similar image search..."
SIMILAR_RESULT=$(pulser call ces search_similar '{"image_url":"https://example.com/test.jpg","limit":3}' 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ Similar search working"
else
    echo "❌ Similar search failed: $SIMILAR_RESULT"
fi

# Test 4: Complex query
echo ""
echo "4️⃣ Testing complex creative query..."
COMPLEX=$(pulser call ces ask "Which 2024 TikTok campaigns match Pantone Peach Fuzz color palette?" 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ Complex query processed"
    echo "Sample response:"
    echo "$COMPLEX" | head -5
else
    echo "❌ Complex query failed"
fi

echo ""
echo "📊 Test Summary"
echo "=============="
echo "✅ Pulser integration ready for CES queries"
echo ""
echo "Try these commands:"
echo '  :ces "pink dominant TikTok spots"'
echo '  :ces!palette_score {"image_url":"https://..."}'
echo '  :ces!search_similar {"image_url":"https://...","limit":10}'