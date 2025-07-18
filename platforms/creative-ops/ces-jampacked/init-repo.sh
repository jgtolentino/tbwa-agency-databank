#!/bin/bash

# Initialize Palette Forge Repository
echo "🎨 Initializing Palette Forge repository..."

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Are you in the palette-forge directory?"
    exit 1
fi

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git remote add origin git@github.com:tbwa/palette-forge.git
fi

# Create feature branch
echo "🌿 Creating service-wrap branch..."
git checkout -b service-wrap 2>/dev/null || git checkout service-wrap

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "feat: palette service wrapper + CES gateway

- Add FastAPI service wrapper for palette forge model
- Add CES Gateway for orchestration
- Add Supabase schema with pgvector support
- Add Render deployment configuration
- Add CI/CD workflow
- Add integration tests"

# Show status
echo ""
echo "✅ Repository initialized!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push --set-upstream origin service-wrap"
echo "2. Configure secrets in Doppler/KeyKey"
echo "3. Deploy to Render"
echo "4. Run Supabase migrations"
echo ""