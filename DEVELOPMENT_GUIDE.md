# TBWA Unified Platform - Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- PostgreSQL (via Supabase)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/jgtolentino/tbwa-agency-databank.git
cd tbwa-agency-databank

# Install all dependencies
npm install

# Install platform-specific dependencies
npm run install-all
```

## Platform Development

### CES • JamPacked (Creative Operations)
```bash
# Navigate to platform
cd platforms/creative-ops/ces-jampacked

# Start development server
npm run dev

# Build for production
npm run build
```

### Scout Dashboard 3.0
```bash
# Navigate to platform
cd platforms/scout-dash

# Start development server
npm run dev

# Test AI bots
open http://localhost:3000/test-bots

# Build for production
npm run build
```

### Infrastructure Services
```bash
# Start MCP Reader (Port 8888)
npm run start:mcp-reader

# Start MCP Writer services
npm run start:mcp-writer

# Deploy infrastructure
npm run deploy:infrastructure
```

## Monorepo Commands

### Development
```bash
# Start all platforms
npm run dev

# Start specific platform
npm run dev:ces        # CES • JamPacked
npm run dev:scout      # Scout Dashboard

# Build all platforms
npm run build

# Run tests across all platforms
npm run test

# Lint all code
npm run lint
```

### Workspace Management
```bash
# Add new platform
mkdir -p platforms/new-platform
cd platforms/new-platform
npm init -y

# Add to root package.json workspaces array
# "workspaces": ["platforms/new-platform"]
```

## Branch Strategy

### Main Branches
- **`main`**: Production releases
- **`develop`**: Development integration

### Feature Branches
- **`platform/creative-ops/*`**: Creative operations features
- **`platform/scout-dash/*`**: Scout dashboard features
- **`infrastructure/*`**: Infrastructure updates
- **`feature/*`**: Cross-platform features

### Development Workflow
```bash
# Create feature branch
git checkout -b platform/scout-dash/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push -u origin platform/scout-dash/new-feature

# Create pull request to develop
```

## Database Development

### Schema Management
```bash
# Navigate to database infrastructure
cd infrastructure/database

# Create new migration
supabase migration new feature-name

# Apply migrations
supabase db reset

# Generate types
supabase gen types typescript --local > types/database.ts
```

### MCP Service Development
```bash
# Navigate to MCP services
cd infrastructure/mcp-services

# Create new writer service
mkdir writer-new-platform
cd writer-new-platform

# Copy template
cp -r ../writer/* .

# Update port and schema configuration
# Edit config.json
```

## Testing

### Unit Tests
```bash
# Run all tests
npm run test

# Run platform-specific tests
npm run test --workspace=platforms/scout-dash

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Test MCP services
npm run test:mcp

# Test database connections
npm run test:db

# Test end-to-end
npm run test:e2e
```

## Deployment

### Development Environment
```bash
# Start all services
npm run dev

# Start infrastructure only
npm run dev:infrastructure

# Start specific platform
npm run dev:ces
npm run dev:scout
```

### Production Deployment
```bash
# Build all platforms
npm run build

# Deploy infrastructure
npm run deploy:infrastructure

# Deploy specific platform
npm run build:ces && npm run deploy:ces
npm run build:scout && npm run deploy:scout
```

### Environment Variables
Each platform maintains its own `.env.local` file:

```bash
# platforms/creative-ops/ces-jampacked/.env.local
VITE_API_URL=https://api.example.com

# platforms/scout-dash/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Code Standards

### TypeScript
- Strict mode enabled
- Shared types in `infrastructure/shared-libs/types`
- Platform-specific types in each platform

### Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format with Prettier
npm run format
```

### Git Hooks
- Pre-commit: Lint and format
- Pre-push: Run tests
- Commit message: Conventional commits

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check if MCP services are running on correct ports
2. **Database connection**: Verify Supabase credentials
3. **Build errors**: Clear node_modules and reinstall
4. **TypeScript errors**: Check shared types and imports

### Debug Commands
```bash
# Check port usage
lsof -i :8888-8898

# Verify database connection
supabase status

# Check service logs
npm run logs:mcp

# Reset everything
npm run clean && npm run install-all
```

## Contributing

1. Fork the repository
2. Create feature branch from `develop`
3. Make changes following code standards
4. Add tests for new features
5. Update documentation
6. Create pull request

## Support

- 📧 Email: dev-team@tbwa.com
- 💬 Slack: #tbwa-unified-platform
- 📖 Docs: `/docs` directory
- 🐛 Issues: GitHub Issues