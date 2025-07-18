# Setting Up Credentials for Ask CES

## Required Environment Variables

Before proceeding with deployment, you need to set up the following credentials:

### 1. Supabase Configuration

You'll need a Supabase project. If you don't have one:
1. Go to https://supabase.com
2. Create a new project
3. Get your credentials from Settings > API

```bash
# From your Supabase project settings
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_ANON_KEY="eyJ..."  # Your anon/public key
```

### 2. Database URL (for pgvector)

Get the database connection string from Supabase:
1. Go to Settings > Database
2. Copy the connection string
3. Make sure to use the pooled connection for better performance

```bash
export PGVECTOR_URL="postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
```

### 3. API Token

Generate a secure token for service-to-service authentication:

```bash
# Generate automatically
export CES_API_TOKEN=$(openssl rand -hex 32)

# Or set manually
export CES_API_TOKEN="your-secure-token-here"
```

## Quick Setup

Once you have your Supabase project, run:

```bash
# Set your credentials
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export PGVECTOR_URL="your-database-url"

# Run the setup script
cd /Users/tbwa/palette-forge
./scripts/setup-secrets.sh
```

## Alternative: Use Existing Supabase

If you already have a Supabase project for other TBWA services:
- You can reuse the same project
- The migration will create a new `creative_ops` schema
- This keeps data isolated from other schemas

## Next Steps

After setting up credentials:
1. Push to GitHub: `git push --set-upstream origin service-wrap`
2. Connect repo to Render
3. Run database migrations
4. Test the integration

## Security Notes

- Never commit credentials to git
- Use Doppler/KeyKey for production secrets
- Rotate API tokens regularly
- Use read-only keys where possible