# 🚀 Deploy MCP Backend Online - Complete Guide

## 📋 Pre-Deployment Checklist

### ✅ MUST COMPLETE BEFORE DEPLOYING:

1. **Fix all mock violations**:
   ```bash
   npm run verify-backend-strict
   # Must show: ✅ PASSED: No critical issues found
   ```

2. **Verify real backend integration**:
   ```bash
   npm run verify-backend-live-strict
   # Must show: REAL_BACKEND_CONFIRMED
   ```

3. **Add Backend Status Monitor to UI**:
   ```tsx
   import { BackendStatusMonitor } from './backend-status-monitor';
   // Add to your layout: <BackendStatusMonitor />
   ```

## 🛠️ Deployment Steps

### 1. Prepare MCP SQLite Server

First, let's check your MCP server location:

```bash
cd /Users/tbwa/Documents/GitHub/mcp-sqlite-server
```

### 2. Create Production Configuration

Create `config/server-config-prod.json`:

```json
{
  "host": "0.0.0.0",
  "port": 3000,
  "database": {
    "path": "./data/database.sqlite",
    "initOnStart": true
  },
  "cors": {
    "origin": ["https://your-frontend-domain.com", "http://localhost:8080"],
    "credentials": true
  },
  "security": {
    "apiKey": "${API_KEY}",
    "rateLimit": {
      "windowMs": 900000,
      "max": 100
    }
  },
  "logging": {
    "level": "info",
    "format": "json"
  }
}
```

### 3. Update package.json

Add these scripts to your MCP server's `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "start:prod": "NODE_ENV=production node dist/index.js"
  }
}
```

### 4. Create Render Configuration

Create `render.yaml` in your MCP server root:

```yaml
services:
  - type: web
    name: mcp-sqlite-backend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: API_KEY
        generateValue: true
      - key: DB_PATH
        value: /opt/render/project/src/data/database.sqlite
      - key: CONFIG_PATH
        value: /opt/render/project/src/config/server-config-prod.json
    disk:
      name: sqlite-data
      mountPath: /opt/render/project/src/data
      sizeGB: 1
```

### 5. Create Deployment Script

Create `deploy-backend.sh`:

```bash
#!/bin/bash

echo "🚀 MCP Backend Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
  echo "❌ Error: Not in MCP server directory"
  echo "Please run from /Users/tbwa/Documents/GitHub/mcp-sqlite-server"
  exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Check if dist exists
if [ ! -d "dist" ]; then
  echo "❌ Error: dist directory not found after build"
  exit 1
fi

# Initialize git if needed
if [ ! -d ".git" ]; then
  echo "📝 Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit for deployment"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
  echo "📝 Creating .gitignore..."
  cat > .gitignore << EOF
node_modules/
.env
.env.local
*.log
.DS_Store
EOF
fi

echo "✅ Project ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/mcp-sqlite-server.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Render will use render.yaml automatically"
```

### 6. Create Railway Alternative

Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### 7. Update Frontend Environment

Once deployed, update your frontend `.env`:

```env
# Local development
VITE_MCP_HTTP_URL=http://localhost:3000
VITE_USE_MOCK_API=false

# Production (update after deployment)
# VITE_MCP_HTTP_URL=https://mcp-backend-xxxxx.onrender.com
# VITE_API_KEY=your-production-api-key
```

## 🚨 CRITICAL: Pre-Deployment Verification

### Run this checklist BEFORE deploying:

```bash
# 1. In your frontend directory
cd /Users/tbwa/Documents/GitHub/tbwa-lions-palette-forge

# 2. Run ALL verifications
npm run verify-backend-strict
# MUST PASS with 0 issues

npm run verify-backend-live-strict  
# MUST show REAL_BACKEND_CONFIRMED

# 3. Check that BackendStatusMonitor is added
grep -r "BackendStatusMonitor" src/

# 4. Ensure no hardcoded localhost URLs
grep -r "localhost:3000" src/ --exclude-dir=node_modules
```

## 📊 Post-Deployment Verification

After deployment, verify everything works:

1. **Check deployed backend health**:
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```

2. **Update frontend to use deployed backend**:
   ```env
   VITE_MCP_HTTP_URL=https://your-backend-url.onrender.com
   ```

3. **Run frontend verification against live backend**:
   ```bash
   npm run verify-backend-live-strict
   ```

## 🔐 Security Checklist

- [ ] API key is set and not hardcoded
- [ ] CORS is configured for your frontend domain only
- [ ] Rate limiting is enabled
- [ ] No sensitive data in git history
- [ ] SQLite file has proper permissions

## 📈 Scaling Considerations

### When to migrate from SQLite:
- More than 5 concurrent users
- Write-heavy workloads
- Need for real backups
- Multiple server instances

### Migration path:
1. PostgreSQL on Render/Railway (easiest)
2. MySQL on PlanetScale
3. MongoDB Atlas for document storage

## 🛑 DO NOT DEPLOY IF:

- ❌ Any mock patterns remain unconditional
- ❌ verify-backend-strict shows failures
- ❌ BackendStatusMonitor not integrated
- ❌ Hardcoded localhost URLs exist
- ❌ No error handling for API failures

## 🎯 Final Command Sequence

```bash
# 1. Fix all issues
npm run verify-backend-strict

# 2. Deploy backend
cd /Users/tbwa/Documents/GitHub/mcp-sqlite-server
./deploy-backend.sh

# 3. Update frontend env
cd /Users/tbwa/Documents/GitHub/tbwa-lions-palette-forge
# Edit .env with new backend URL

# 4. Verify everything
npm run verify-backend-live-strict

# 5. Deploy frontend
git add .
git commit -m "feat: connect to deployed backend"
git push
```

---

**⚠️ REMEMBER: Only deploy when ALL verifications pass!**