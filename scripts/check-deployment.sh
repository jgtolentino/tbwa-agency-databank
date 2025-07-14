#!/bin/bash

# Check Deployment Status
echo "🚀 Checking Ask CES deployment status..."
echo ""

# Configuration
PALETTE_SVC_URL="${PALETTE_SERVICE_URL:-https://palette-svc.onrender.com}"
CES_GW_URL="${CES_GATEWAY_URL:-https://ces-gw.onrender.com}"

# Function to check service
check_service() {
    local name=$1
    local url=$2
    
    echo -n "Checking $name... "
    
    if curl -s -f -m 5 "$url/health" > /dev/null 2>&1; then
        RESPONSE=$(curl -s "$url/health")
        STATUS=$(echo $RESPONSE | jq -r '.status' 2>/dev/null || echo "unknown")
        echo "✅ Online (status: $STATUS)"
        return 0
    else
        echo "❌ Offline or unreachable"
        return 1
    fi
}

# Check services
echo "🔍 Service Health Checks:"
echo "========================"
check_service "Palette Service" "$PALETTE_SVC_URL"
PALETTE_STATUS=$?

check_service "CES Gateway" "$CES_GW_URL"
GATEWAY_STATUS=$?

# Check Supabase connection (via gateway)
echo ""
echo "🗄️ Database Connectivity:"
echo "========================"
if [ $GATEWAY_STATUS -eq 0 ]; then
    HEALTH=$(curl -s "$CES_GW_URL/health")
    SUPABASE_STATUS=$(echo $HEALTH | jq -r '.services.supabase' 2>/dev/null)
    
    if [ "$SUPABASE_STATUS" == "healthy" ]; then
        echo "✅ Supabase: Connected"
    else
        echo "❌ Supabase: $SUPABASE_STATUS"
    fi
else
    echo "⚠️  Cannot check - Gateway offline"
fi

# Quick functionality test
echo ""
echo "🧪 Quick Functionality Test:"
echo "==========================="
if [ $GATEWAY_STATUS -eq 0 ] && [ -n "$CES_API_TOKEN" ]; then
    echo -n "Testing /ask endpoint... "
    
    TEST_RESPONSE=$(curl -s -X POST "$CES_GW_URL/ask" \
        -H "Authorization: Bearer $CES_API_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"prompt": "test query", "limit": 1}' 2>/dev/null)
    
    if [ $? -eq 0 ] && echo $TEST_RESPONSE | jq . > /dev/null 2>&1; then
        echo "✅ Working"
    else
        echo "❌ Failed"
        echo "Response: $TEST_RESPONSE"
    fi
else
    echo "⚠️  Skipped (Gateway offline or no API token)"
fi

# Summary
echo ""
echo "📊 Deployment Summary:"
echo "===================="
if [ $PALETTE_STATUS -eq 0 ] && [ $GATEWAY_STATUS -eq 0 ]; then
    echo "✅ All services online and healthy!"
    echo ""
    echo "🎉 Ask CES is ready to use!"
    echo ""
    echo "Try these commands:"
    echo "  Pulser: :ces 'top 3 pink ads'"
    echo "  Claude: /ces.ask Which campaigns match Pantone colors?"
else
    echo "❌ Deployment incomplete or unhealthy"
    echo ""
    echo "Check Render logs for details:"
    echo "  https://dashboard.render.com"
fi