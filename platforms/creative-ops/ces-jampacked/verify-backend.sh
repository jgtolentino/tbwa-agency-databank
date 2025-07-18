#!/bin/bash

# Backend Verification Script for Lions Palette Forge
# This script helps verify if the application is connected to a real backend

echo "🔍 Backend Verification Script for Lions Palette Forge"
echo "====================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check for mock data patterns
check_mock_patterns() {
    echo "1. Checking for mock data patterns in source code..."
    echo "---------------------------------------------------"
    
    # Search for mock-related files and patterns
    echo "Searching for mock data files..."
    mock_files=$(find src -name "*mock*" -o -name "*fake*" -o -name "*stub*" | wc -l)
    
    if [ $mock_files -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found $mock_files files with mock/fake/stub patterns:${NC}"
        find src -name "*mock*" -o -name "*fake*" -o -name "*stub*" | head -10
    else
        echo -e "${GREEN}✅ No obvious mock files found${NC}"
    fi
    
    echo ""
    echo "Searching for mock data usage in code..."
    mock_usage=$(grep -r "mock\|fake\|generateMock\|mockData" src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | wc -l)
    
    if [ $mock_usage -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found $mock_usage references to mock data:${NC}"
        grep -r "mock\|fake\|generateMock\|mockData" src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | head -5
    else
        echo -e "${GREEN}✅ No mock data references found${NC}"
    fi
    
    echo ""
}

# Function to check API configuration
check_api_config() {
    echo "2. Checking API configuration..."
    echo "--------------------------------"
    
    # Check for API configuration files
    if [ -f "src/config/api.ts" ] || [ -f "src/config/api.js" ]; then
        echo -e "${GREEN}✅ API configuration file found${NC}"
        
        # Check for localhost or mock endpoints
        localhost_count=$(grep -i "localhost\|127.0.0.1\|mock" src/config/api* | wc -l)
        if [ $localhost_count -gt 0 ]; then
            echo -e "${YELLOW}⚠️  Found localhost/mock references in API config:${NC}"
            grep -i "localhost\|127.0.0.1\|mock" src/config/api* | head -5
        fi
        
        # Check for MCP integration
        mcp_count=$(grep -i "mcp\|model.*context.*protocol" src/config/* | wc -l)
        if [ $mcp_count -gt 0 ]; then
            echo -e "${GREEN}✅ MCP (Model Context Protocol) integration detected${NC}"
        fi
    else
        echo -e "${RED}❌ No API configuration file found${NC}"
    fi
    
    echo ""
}

# Function to check service implementations
check_services() {
    echo "3. Checking service implementations..."
    echo "--------------------------------------"
    
    # Check video analysis service
    if [ -f "src/services/videoAnalysis.ts" ] || [ -f "src/services/videoAnalysis.js" ]; then
        echo "Video Analysis Service:"
        
        # Check for fetch/axios calls
        api_calls=$(grep -E "fetch\(|axios\.|http" src/services/videoAnalysis* | wc -l)
        if [ $api_calls -gt 0 ]; then
            echo -e "${GREEN}✅ Found $api_calls API calls in video analysis service${NC}"
        else
            echo -e "${RED}❌ No API calls found in video analysis service${NC}"
        fi
        
        # Check for fallback to mock data
        fallback=$(grep -i "fallback\|mock.*data\|generate.*mock" src/services/videoAnalysis* | wc -l)
        if [ $fallback -gt 0 ]; then
            echo -e "${YELLOW}⚠️  Service has fallback to mock data (found $fallback references)${NC}"
        fi
    fi
    
    echo ""
}

# Function to check environment configuration
check_env_config() {
    echo "4. Checking environment configuration..."
    echo "----------------------------------------"
    
    # Check for .env files
    if [ -f ".env" ] || [ -f ".env.local" ] || [ -f ".env.production" ]; then
        echo -e "${GREEN}✅ Environment configuration files found${NC}"
        
        # Check for API URL configuration
        if [ -f ".env.example" ]; then
            echo "Environment variables expected:"
            grep -E "API|BACKEND|URL" .env.example | head -5
        fi
    else
        echo -e "${YELLOW}⚠️  No .env files found (may use default values)${NC}"
    fi
    
    echo ""
}

# Function to analyze API endpoints
analyze_endpoints() {
    echo "5. Analyzing API endpoint patterns..."
    echo "-------------------------------------"
    
    # Search for API endpoint definitions
    echo "API endpoints found in code:"
    grep -r "'/api/\|/v1/\|/backend/" src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v "mock\|test" | head -10
    
    echo ""
}

# Function to check for real-time features
check_realtime() {
    echo "6. Checking for real-time features..."
    echo "--------------------------------------"
    
    # Check for WebSocket configuration
    websocket=$(grep -r "WebSocket\|ws://\|wss://" src | wc -l)
    if [ $websocket -gt 0 ]; then
        echo -e "${GREEN}✅ WebSocket configuration found (real-time updates possible)${NC}"
    else
        echo -e "${YELLOW}⚠️  No WebSocket configuration found${NC}"
    fi
    
    # Check for polling or real-time monitoring
    polling=$(grep -r "setInterval\|setTimeout.*fetch\|poll" src/services | wc -l)
    if [ $polling -gt 0 ]; then
        echo -e "${GREEN}✅ Polling/monitoring patterns found${NC}"
    fi
    
    echo ""
}

# Function to generate summary
generate_summary() {
    echo "========================================"
    echo "📊 BACKEND VERIFICATION SUMMARY"
    echo "========================================"
    echo ""
    echo "Based on the code analysis:"
    echo ""
    
    # Count indicators
    mock_indicators=0
    backend_indicators=0
    
    # Analyze results
    if [ $mock_files -gt 0 ] || [ $mock_usage -gt 0 ]; then
        mock_indicators=$((mock_indicators + 1))
        echo -e "${YELLOW}⚠️  Mock data patterns detected${NC}"
    fi
    
    if [ $api_calls -gt 0 ]; then
        backend_indicators=$((backend_indicators + 1))
        echo -e "${GREEN}✅ Real API calls implemented${NC}"
    fi
    
    if [ $mcp_count -gt 0 ]; then
        backend_indicators=$((backend_indicators + 1))
        echo -e "${GREEN}✅ MCP backend integration found${NC}"
    fi
    
    if [ $fallback -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Fallback to mock data available${NC}"
    fi
    
    echo ""
    echo "CONCLUSION:"
    if [ $backend_indicators -gt $mock_indicators ]; then
        echo -e "${GREEN}✅ Application appears to have real backend integration${NC}"
        echo "   However, it also includes mock data fallbacks for resilience."
    else
        echo -e "${YELLOW}⚠️  Application may be primarily using mock data${NC}"
        echo "   Real backend integration needs verification via network inspection."
    fi
    
    echo ""
    echo "NEXT STEPS:"
    echo "1. Run the application and check Chrome DevTools Network tab"
    echo "2. Test with network disconnected to see error handling"
    echo "3. Monitor actual API calls during user interactions"
    echo "4. Check backend logs if you have server access"
    echo ""
}

# Main execution
check_mock_patterns
check_api_config
check_services
check_env_config
analyze_endpoints
check_realtime
generate_summary

echo "Script completed. For live verification, run the app and check network traffic."