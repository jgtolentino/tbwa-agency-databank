# Ask CES Launch Guide

## ✅ Pre-Launch Checklist

### 1. Repository Setup ✓
- [ ] Fork jgtolentino/tbwa-lions-palette-forge to your org
- [ ] Clone locally: `git clone git@github.com:tbwa/palette-forge.git`
- [ ] Run `./init-repo.sh` to set up branch and commit
- [ ] Push to GitHub: `git push --set-upstream origin service-wrap`

### 2. Secrets Configuration
- [ ] Set environment variables:
  ```bash
  export SUPABASE_URL=https://your-project.supabase.co
  export SUPABASE_ANON_KEY=eyJ...
  export PGVECTOR_URL=postgres://...
  ```
- [ ] Run `./scripts/setup-secrets.sh`
- [ ] Save the generated CES_API_TOKEN
- [ ] Update env-sync.yml with new services

### 3. Render Deployment
- [ ] Connect GitHub repo to Render
- [ ] Deploy using render.yaml blueprint
- [ ] Link KeyKey environment group
- [ ] Verify both services are healthy

### 4. Database Setup
- [ ] Run Supabase migration:
  ```bash
  supabase db push --file supabase/migrations/create_creative_ops_schema.sql
  ```
- [ ] Verify tables created:
  ```sql
  select * from information_schema.tables 
  where table_schema = 'creative_ops';
  ```

### 5. CI/CD Pipeline
- [ ] Merge service-wrap PR to main
- [ ] Monitor GitHub Actions build
- [ ] Verify Docker images pushed to GHCR
- [ ] Confirm Render auto-deploy triggered

### 6. Integration Testing
- [ ] Export test variables:
  ```bash
  export CES_GATEWAY_URL=https://ces-gw.onrender.com
  export CES_API_TOKEN=<your-token>
  ```
- [ ] Run smoke tests: `./scripts/test-ces-integration.sh`
- [ ] All tests should pass

### 7. Client Configuration

#### Pulser
- [ ] Add agent config: `pulser config add packages/agents/ces_reader.yaml`
- [ ] Test: `:ces "top 3 pink ads"`

#### Claude Desktop
- [ ] Add to MCP tools:
  ```json
  {
    "ces": {
      "url": "https://ces-gw.onrender.com",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
  ```
- [ ] Test: `/ces.ask Show me warm-toned campaigns`

#### ChatGPT
- [ ] Create Custom GPT
- [ ] Upload ces-gateway/openapi.yaml
- [ ] Add Bearer auth with your token
- [ ] Test with creative queries

## 🚀 Post-Launch Optimization

### Performance
- [ ] Monitor Render metrics
- [ ] Consider GPU upgrade for palette-svc
- [ ] Implement caching layer

### Data Pipeline
- [ ] Set up auto-embedding on asset upload
- [ ] Create batch processing jobs
- [ ] Add data quality monitoring

### Features
- [ ] Extend query types
- [ ] Add real-time WebSocket support
- [ ] Implement advanced RAG patterns

## 🆘 Troubleshooting

### Service Won't Start
```bash
# Check Render logs
render logs palette-svc --tail
render logs ces-gw --tail

# Verify env vars
render env palette-svc
```

### Database Connection Issues
```bash
# Test connection
psql $PGVECTOR_URL -c "SELECT 1"

# Check pgvector extension
psql $PGVECTOR_URL -c "SELECT * FROM pg_extension WHERE extname = 'vector'"
```

### Authentication Failures
- Verify CES_API_TOKEN matches across all services
- Check Bearer token format: `Authorization: Bearer TOKEN`
- Ensure KeyKey is syncing properly

## 📞 Support

- Render issues: status.render.com
- Supabase issues: status.supabase.com
- Integration help: Create issue in this repo