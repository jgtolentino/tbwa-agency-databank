#!/bin/bash

# Start script for Lions Palette Forge with Backend Integration

echo "🚀 Starting Lions Palette Forge with Backend Integration"
echo "=========================================="

# Check if backend is accessible
echo "📡 Checking backend connection..."
BACKEND_URL="https://mcp-sqlite-server.onrender.com"
if curl -s "$BACKEND_URL/health" > /dev/null; then
    echo "✅ Backend is online at $BACKEND_URL"
else
    echo "❌ Backend is not accessible at $BACKEND_URL"
    echo "Please ensure the backend is deployed and running"
    exit 1
fi

# Check environment variables
echo ""
echo "🔧 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
    
    # Check if API key is set
    if grep -q "VITE_MCP_API_KEY=your-api-key-here" .env; then
        echo "⚠️  Warning: API key is not configured in .env"
        echo "   Update VITE_MCP_API_KEY with your actual API key"
    else
        echo "✅ API key is configured"
    fi
    
    # Check if mock mode is disabled
    if grep -q "VITE_USE_MOCK_API=false" .env; then
        echo "✅ Mock API is disabled (using live backend)"
    else
        echo "⚠️  Warning: Mock API may be enabled"
    fi
else
    echo "❌ .env file not found"
    echo "Creating .env file..."
    cat > .env << EOF
# Lions Palette Forge - Backend Configuration
VITE_MCP_HTTP_URL=https://mcp-sqlite-server.onrender.com
VITE_MCP_API_KEY=sk-test-123456
VITE_USE_MOCK_API=false
VITE_NODE_ENV=development
EOF
    echo "✅ Created .env file with default configuration"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo ""
echo "🎨 Starting Lions Palette Forge..."
echo "===================================="
echo "📌 Access the app at: http://localhost:8080"
echo "📌 Backend API: $BACKEND_URL"
echo ""
echo "✨ Features available with backend:"
echo "   - Live video analysis"
echo "   - Real campaign data"
echo "   - Document extraction"
echo "   - Market intelligence"
echo ""

# Run the development server
npm run dev