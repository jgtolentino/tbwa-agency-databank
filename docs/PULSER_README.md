# Pulser CES Integration

Pure Pulser CLI workflow for Ask CES - no Claude/Anthropic dependencies.

## Quick Start

```bash
# 1. Set environment variables
export CES_API_TOKEN=********************************
export CES_GATEWAY_URL=https://ces-gw.onrender.com

# 2. Install CES agents
./scripts/pulser-dev-setup.sh

# 3. Test the integration
./scripts/test-pulser-integration.sh
```

## Available Commands

### Basic Queries
```bash
:ces "pink dominant TikTok spots 2024"
:ces "automotive campaigns with warm color palettes"
:ces "top 5 campaigns matching Pantone Peach Fuzz"
```

### Palette Scoring
```bash
:ces!palette_score '{"image_url":"https://example.com/creative.jpg"}'
```

### Similar Image Search
```bash
:ces!search_similar '{"image_url":"https://example.com/reference.jpg","limit":10}'
```

## CI/CD Migrations

For database migrations in CI only:

```bash
# Start writer MCP locally
docker compose -f docker-compose.writer.yml up

# Run migration
pulser call ces_writer ddl "ALTER TABLE creative_ops.assets ADD COLUMN brand TEXT;"

# Bulk insert
pulser call ces_writer bulk_insert '{
  "table": "creative_ops.campaigns",
  "records": [
    {"name": "Summer 2024", "brand": "Nike"},
    {"name": "Holiday Special", "brand": "Apple"}
  ]
}'
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| CES_API_TOKEN | Bearer token for CES Gateway | Yes |
| CES_GATEWAY_URL | CES Gateway endpoint | Yes |
| CES_SERVICE_ROLE | Service role key (CI only) | CI only |

## File Structure

```
packages/agents/
├── ces_reader.yaml    # Read-only queries (dev/prod)
└── ces_writer.yaml    # Write operations (CI only)

scripts/
├── pulser-dev-setup.sh      # Install agents
├── test-pulser-integration.sh # Test suite
└── test-ces-integration.sh   # Full integration test

docker-compose.writer.yml     # Local writer MCP
```

## Troubleshooting

### Agent not found
```bash
pulser list | grep ces
# If missing, run: ./scripts/pulser-dev-setup.sh
```

### Authentication errors
```bash
# Verify token is set
echo $CES_API_TOKEN
# Should show 32+ character token
```

### Connection issues
```bash
# Test gateway directly
curl -H "Authorization: Bearer $CES_API_TOKEN" \
     $CES_GATEWAY_URL/health
```

## Advanced Usage

### Custom palette thresholds
```bash
:ces "campaigns with >80% warm colors and <20% cool colors"
```

### Multi-criteria search
```bash
:ces "2024 automotive campaigns matching both Pantone Living Coral and Ultra Violet"
```

### Export results
```bash
:ces "top 10 pink campaigns" | jq -r '.results[] | [.id, .title, .palette_scores.pink] | @csv' > pink_campaigns.csv
```

## Integration with GitHub Actions

The `pulser-ci.yml` workflow automatically:
1. Tests all Pulser commands on PR
2. Runs migrations on merge to main
3. Validates agent configurations

No manual intervention needed - just push and deploy!