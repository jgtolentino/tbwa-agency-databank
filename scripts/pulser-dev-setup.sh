#!/bin/bash

# Pulser Development Setup for CES
echo "🚀 Setting up Pulser for CES development..."
echo ""

# Check if Pulser is installed
if ! command -v pulser &> /dev/null; then
    echo "❌ Pulser not found. Please install Pulser first."
    exit 1
fi

# Set up environment variables
echo "📝 Setting environment variables..."
if [ -z "$CES_API_TOKEN" ]; then
    echo "⚠️  CES_API_TOKEN not set. Using default for development."
    export CES_API_TOKEN="dev-token-replace-in-production"
fi

if [ -z "$CES_GATEWAY_URL" ]; then
    export CES_GATEWAY_URL="https://ces-gw.onrender.com"
fi

# Install agent configurations
echo ""
echo "📦 Installing CES agents..."
pulser config add packages/agents/ces_reader.yaml
echo "✅ CES reader agent installed"

# Only install writer in CI/dev environments
if [ "$CI" = "true" ] || [ "$INSTALL_WRITER" = "true" ]; then
    pulser config add packages/agents/ces_writer.yaml
    echo "✅ CES writer agent installed (CI/dev only)"
fi

# Test the installation
echo ""
echo "🧪 Testing Pulser setup..."
pulser list | grep ces
if [ $? -eq 0 ]; then
    echo "✅ CES agents registered successfully"
else
    echo "❌ Failed to register CES agents"
    exit 1
fi

# Show available commands
echo ""
echo "📚 Available Pulser CES Commands:"
echo "================================="
echo '  :ces "query"                     - Natural language creative search'
echo '  :ces!palette_score {...}         - Score image palette'
echo '  :ces!search_similar {...}        - Find similar images'
echo ""
echo "Examples:"
echo '  :ces "top 3 pink dominant ads from 2024"'
echo '  :ces!palette_score {"image_url":"https://example.com/ad.jpg"}'
echo '  :ces!search_similar {"image_url":"https://example.com/ref.jpg","limit":5}'
echo ""
echo "✅ Pulser setup complete!"