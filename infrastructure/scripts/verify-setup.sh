#!/bin/bash

# Verify Palette Forge Setup
echo "🔍 Verifying Palette Forge setup..."
echo ""

# Check directory structure
echo "📁 Checking directory structure..."
REQUIRED_DIRS=("service" "ces-gateway" "supabase/migrations" "scripts" ".github/workflows")
MISSING_DIRS=()

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        MISSING_DIRS+=("$dir")
        echo "  ❌ Missing: $dir"
    else
        echo "  ✅ Found: $dir"
    fi
done

# Check required files
echo ""
echo "📄 Checking required files..."
REQUIRED_FILES=(
    "service/app.py"
    "service/Dockerfile"
    "service/requirements.txt"
    "ces-gateway/app.py"
    "ces-gateway/Dockerfile"
    "render.yaml"
    "supabase/migrations/create_creative_ops_schema.sql"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
        echo "  ❌ Missing: $file"
    else
        echo "  ✅ Found: $file"
    fi
done

# Check environment variables
echo ""
echo "🔐 Checking environment variables..."
ENV_VARS=("SUPABASE_URL" "SUPABASE_ANON_KEY" "CES_API_TOKEN")
MISSING_ENV=()

for var in "${ENV_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_ENV+=("$var")
        echo "  ❌ Not set: $var"
    else
        echo "  ✅ Set: $var"
    fi
done

# Summary
echo ""
echo "📊 Summary:"
echo "==========="

if [ ${#MISSING_DIRS[@]} -eq 0 ] && [ ${#MISSING_FILES[@]} -eq 0 ] && [ ${#MISSING_ENV[@]} -eq 0 ]; then
    echo "✅ All checks passed! Ready to deploy."
else
    echo "❌ Setup incomplete. Please fix the following:"
    
    if [ ${#MISSING_DIRS[@]} -gt 0 ]; then
        echo ""
        echo "Missing directories:"
        for dir in "${MISSING_DIRS[@]}"; do
            echo "  - $dir"
        done
    fi
    
    if [ ${#MISSING_FILES[@]} -gt 0 ]; then
        echo ""
        echo "Missing files:"
        for file in "${MISSING_FILES[@]}"; do
            echo "  - $file"
        done
    fi
    
    if [ ${#MISSING_ENV[@]} -gt 0 ]; then
        echo ""
        echo "Missing environment variables:"
        for var in "${MISSING_ENV[@]}"; do
            echo "  - $var"
        done
    fi
    
    exit 1
fi

echo ""
echo "Next step: Push to GitHub and deploy to Render!"