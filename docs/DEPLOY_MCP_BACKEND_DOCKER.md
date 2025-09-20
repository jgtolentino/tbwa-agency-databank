# 🐳 Deploy MCP Backend with Docker

## 📋 Complete Docker Deployment Guide

### Step 1: Create MCP Backend Directory Structure

First, let's check your MCP server location:
```bash
cd /Users/tbwa/Documents/GitHub/mcp-sqlite-server
```

### Step 2: Create Dockerfile

Create `Dockerfile` in your MCP server root:

```dockerfile
# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY src ./src
COPY config ./config
COPY data ./data

# Build TypeScript (if needed)
RUN npm install -g typescript
RUN npm run build

# Expose the server port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV DB_PATH=/app/data/database.sqlite
ENV CONFIG_PATH=/app/config/server-config-prod.json

# Create data directory if it doesn't exist
RUN mkdir -p /app/data

# Start the server
CMD ["node", "dist/index.js"]
```

### Step 3: Create Production Config

Create `config/server-config-prod.json`:

```json
{
  "host": "0.0.0.0",
  "port": 3000,
  "database": {
    "path": "/app/data/database.sqlite",
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

### Step 4: Create .dockerignore

Create `.dockerignore`:

```
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
*.log
.DS_Store
coverage
.nyc_output
```

### Step 5: Create docker-compose.yml (for local testing)

```yaml
version: '3.9'

services:
  mcp-backend:
    build: .
    container_name: mcp-sqlite-server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_PATH=/app/data/database.sqlite
      - CONFIG_PATH=/app/config/server-config-prod.json
      - API_KEY=${API_KEY:-your-default-api-key}
    volumes:
      - ./data:/app/data
      - ./config:/app/config
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Step 6: Create Deployment Scripts

Create `deploy-docker.sh`:

```bash
#!/bin/bash

echo "🐳 MCP Backend Docker Deployment"
echo "================================"

# Build the Docker image
echo "Building Docker image..."
docker build -t mcp-sqlite-server:latest .

# Test locally
echo "Testing locally..."
docker run -d \
  --name mcp-test \
  -p 3000:3000 \
  -e API_KEY=test-key \
  mcp-sqlite-server:latest

# Wait for health check
echo "Waiting for server to start..."
sleep 5

# Test health endpoint
if curl -f http://localhost:3000/health; then
  echo "✅ Server is healthy!"
else
  echo "❌ Server failed to start"
  docker logs mcp-test
  docker stop mcp-test
  docker rm mcp-test
  exit 1
fi

# Clean up test
docker stop mcp-test
docker rm mcp-test

echo "✅ Docker image ready for deployment!"
```

### Step 7: Create render.yaml (for Render deployment)

```yaml
services:
  - type: web
    name: mcp-sqlite-backend
    runtime: docker
    dockerfilePath: ./Dockerfile
    dockerContext: .
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_PATH
        value: /app/data/database.sqlite
      - key: CONFIG_PATH
        value: /app/config/server-config-prod.json
      - key: API_KEY
        generateValue: true
    disk:
      name: sqlite-data
      mountPath: /app/data
      sizeGB: 1
```

### Step 8: Deploy to Render

1. **Push to GitHub**:
```bash
git add .
git commit -m "Add Docker configuration for deployment"
git push origin main
```

2. **Deploy on Render**:
- Go to [render.com](https://render.com)
- Create New > Web Service
- Connect your GitHub repo
- Choose "Docker" as the environment
- Render will use your `Dockerfile` automatically

3. **Get your URL**:
- After deployment, you'll get: `https://mcp-sqlite-backend-xxxxx.onrender.com`

### Step 9: Update Frontend Configuration

Update your Lions Palette Forge `.env`:

```env
VITE_MCP_HTTP_URL=https://mcp-sqlite-backend-xxxxx.onrender.com
VITE_USE_MOCK_API=false
VITE_API_KEY=your-render-generated-api-key
```

### Step 10: Verify Deployment

```bash
# Check health
curl https://mcp-sqlite-backend-xxxxx.onrender.com/health

# Test an endpoint
curl https://mcp-sqlite-backend-xxxxx.onrender.com/api/jampacked/campaigns \
  -H "Authorization: Bearer your-api-key"
```

## 🚀 Alternative: Deploy to Railway

Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "numReplicas": 1,
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

Then:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

## 🔒 Production Security Checklist

- [ ] Set strong API_KEY in environment variables
- [ ] Configure CORS for your frontend domain only
- [ ] Enable rate limiting
- [ ] Use HTTPS only
- [ ] Don't commit sensitive data to Git
- [ ] Consider migrating to PostgreSQL for production

## 📊 Monitoring

Add health check endpoint in your MCP server:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: fs.existsSync(process.env.DB_PATH) ? 'connected' : 'not found'
  });
});
```

## 🎯 Final Steps

1. Run `chmod +x deploy-docker.sh`
2. Execute `./deploy-docker.sh` to test locally
3. Push to GitHub
4. Deploy to Render/Railway
5. Update frontend `.env`
6. Run `npm run verify-backend-live-strict` with new URL

Your MCP backend will be live and accessible worldwide!