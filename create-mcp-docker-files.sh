#!/bin/bash

echo "🐳 Creating Docker files for MCP SQLite Backend"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
MCP_DIR="/Users/tbwa/Documents/GitHub/mcp-sqlite-server"

if [ ! -d "$MCP_DIR" ]; then
  echo -e "${RED}❌ MCP server directory not found at $MCP_DIR${NC}"
  echo "Please ensure the MCP server is at the correct location."
  exit 1
fi

cd "$MCP_DIR"
echo -e "${GREEN}✅ Found MCP server at $MCP_DIR${NC}"

# Create Dockerfile
echo -e "\n📝 Creating Dockerfile..."
cat > Dockerfile << 'EOF'
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

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the server
CMD ["node", "dist/index.js"]
EOF
echo -e "${GREEN}✅ Created Dockerfile${NC}"

# Create .dockerignore
echo -e "\n📝 Creating .dockerignore..."
cat > .dockerignore << 'EOF'
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
.vscode
.idea
EOF
echo -e "${GREEN}✅ Created .dockerignore${NC}"

# Create docker-compose.yml
echo -e "\n📝 Creating docker-compose.yml..."
cat > docker-compose.yml << 'EOF'
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
      - ./data:/app/data:rw
      - ./config:/app/config:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
EOF
echo -e "${GREEN}✅ Created docker-compose.yml${NC}"

# Create production config if it doesn't exist
if [ ! -f "config/server-config-prod.json" ]; then
  echo -e "\n📝 Creating config/server-config-prod.json..."
  mkdir -p config
  cat > config/server-config-prod.json << 'EOF'
{
  "host": "0.0.0.0",
  "port": 3000,
  "database": {
    "path": "/app/data/database.sqlite",
    "initOnStart": true
  },
  "cors": {
    "origin": ["https://tbwa-lions-palette-forge.vercel.app", "http://localhost:8080"],
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
  },
  "endpoints": {
    "health": "/health",
    "api": "/api"
  }
}
EOF
  echo -e "${GREEN}✅ Created config/server-config-prod.json${NC}"
else
  echo -e "${YELLOW}⚠️  config/server-config-prod.json already exists${NC}"
fi

# Create render.yaml
echo -e "\n📝 Creating render.yaml..."
cat > render.yaml << 'EOF'
services:
  - type: web
    name: mcp-sqlite-backend
    runtime: docker
    dockerfilePath: ./Dockerfile
    dockerContext: .
    healthCheckPath: /health
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
EOF
echo -e "${GREEN}✅ Created render.yaml${NC}"

# Create deploy script
echo -e "\n📝 Creating deploy-docker.sh..."
cat > deploy-docker.sh << 'EOF'
#!/bin/bash

echo "🐳 MCP Backend Docker Deployment"
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Build the Docker image
echo "Building Docker image..."
docker build -t mcp-sqlite-server:latest .

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Docker build failed${NC}"
  exit 1
fi

# Stop any existing container
docker stop mcp-test 2>/dev/null
docker rm mcp-test 2>/dev/null

# Test locally
echo "Testing locally..."
docker run -d \
  --name mcp-test \
  -p 3000:3000 \
  -e API_KEY=test-key \
  mcp-sqlite-server:latest

# Wait for health check
echo "Waiting for server to start..."
for i in {1..10}; do
  if curl -f http://localhost:3000/health 2>/dev/null; then
    echo -e "\n${GREEN}✅ Server is healthy!${NC}"
    break
  fi
  echo -n "."
  sleep 2
done

# Check if server started successfully
if ! curl -f http://localhost:3000/health 2>/dev/null; then
  echo -e "\n${RED}❌ Server failed to start${NC}"
  echo "Docker logs:"
  docker logs mcp-test
  docker stop mcp-test
  docker rm mcp-test
  exit 1
fi

# Clean up test
docker stop mcp-test
docker rm mcp-test

echo -e "${GREEN}✅ Docker image ready for deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git add . && git commit -m 'Add Docker support' && git push"
echo "2. Deploy to Render: Connect your GitHub repo at render.com"
echo "3. Update frontend .env with the new backend URL"
EOF
chmod +x deploy-docker.sh
echo -e "${GREEN}✅ Created deploy-docker.sh (executable)${NC}"

# Create a simple health check endpoint file if needed
if [ ! -f "src/health.ts" ]; then
  echo -e "\n📝 Creating src/health.ts..."
  cat > src/health.ts << 'EOF'
import { Request, Response } from 'express';
import fs from 'fs';

export const healthCheck = (req: Request, res: Response) => {
  const dbPath = process.env.DB_PATH || '/app/data/database.sqlite';
  const dbExists = fs.existsSync(dbPath);
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbExists ? 'connected' : 'not found',
    version: process.env.npm_package_version || '1.0.0'
  });
};
EOF
  echo -e "${GREEN}✅ Created src/health.ts${NC}"
fi

echo -e "\n================================================="
echo -e "${GREEN}🎉 Docker setup complete!${NC}"
echo "================================================="
echo ""
echo "Files created in $MCP_DIR:"
echo "  - Dockerfile"
echo "  - .dockerignore"
echo "  - docker-compose.yml"
echo "  - config/server-config-prod.json"
echo "  - render.yaml"
echo "  - deploy-docker.sh"
echo ""
echo "To test locally:"
echo "  cd $MCP_DIR"
echo "  ./deploy-docker.sh"
echo ""
echo "To deploy to Render:"
echo "  1. Push to GitHub"
echo "  2. Connect repo at render.com"
echo "  3. Render will use the Docker configuration automatically"