# Supabase Edge Functions - AI Bots Deployment Guide

## Overview

This guide shows how to deploy AI Genie, RetailBot, and AdsBot as Supabase Edge Functions for ultra-low latency and zero-ops hosting.

## Prerequisites

1. **Supabase CLI** installed
```bash
npm install -g supabase
```

2. **Supabase Project** with the project reference from your dashboard

3. **API Keys** ready (Groq or OpenAI)

## Step 1: Initialize Supabase

```bash
cd /Users/tbwa/scout-dashboard

# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref cxzllzyxwpyptfretryc
```

## Step 2: Set Environment Secrets

```bash
# Set your AI provider key (choose one)
supabase secrets set GROQ_API_KEY=your-groq-api-key
# OR
supabase secrets set OPENAI_API_KEY=your-openai-api-key

# Optional: Set these if you want to log insights
supabase secrets set SUPABASE_URL=https://cxzllzyxwpyptfretryc.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Deploy Edge Functions

Deploy each bot function:

```bash
# Deploy AI Genie
supabase functions deploy genie --no-verify-jwt

# Deploy RetailBot
supabase functions deploy retailbot --no-verify-jwt

# Deploy AdsBot
supabase functions deploy adsbot --no-verify-jwt
```

> Note: `--no-verify-jwt` makes them public endpoints. Remove this flag if you want to require Supabase auth.

## Step 4: Get Your Function URLs

Your functions will be available at:

```
https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/genie
https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/retailbot
https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/adsbot
```

## Step 5: Update Frontend Environment

Add to your `.env.local` or Vercel environment variables:

```env
NEXT_PUBLIC_GENIE_URL=https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/genie
NEXT_PUBLIC_RETAILBOT_URL=https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/retailbot
NEXT_PUBLIC_ADSBOT_URL=https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/adsbot
```

## Frontend Integration

Create a client service to interact with the edge functions:

```typescript
// lib/ai-bots.ts
export const AIBots = {
  genie: {
    generate: async (prompt: string, context?: any, userRole?: string) => {
      const response = await fetch(process.env.NEXT_PUBLIC_GENIE_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context, user_role: userRole })
      })
      return response.json()
    }
  },

  retailBot: {
    analyze: async (query: string, storeData?: any) => {
      const response = await fetch(process.env.NEXT_PUBLIC_RETAILBOT_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, store_data: storeData })
      })
      return response.json()
    }
  },

  adsBot: {
    analyze: async (campaignData?: any, metricsF focus?: string[]) => {
      const response = await fetch(process.env.NEXT_PUBLIC_ADSBOT_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign_data: campaignData, metrics_focus: metricsFocus })
      })
      return response.json()
    }
  }
}
```

## Usage Examples

### AI Genie
```typescript
const insight = await AIBots.genie.generate(
  "What are the key trends in our Q4 performance?",
  { revenue: "₱1.2M", growth: "15%" },
  "executive"
)
console.log(insight.content)
```

### RetailBot
```typescript
const analysis = await AIBots.retailBot.analyze(
  "How can I improve store performance?",
  { daily_sales: "₱50,000", foot_traffic: 320 }
)
console.log(analysis.recommendations)
```

### AdsBot
```typescript
const campaign = await AIBots.adsBot.analyze(
  { impressions: 150000, clicks: 4500, spend: 25000 },
  ["ctr", "roi"]
)
console.log(campaign.optimization_tips)
```

## Optional: Create AI Insights Table

If you want to track usage, create this table in Supabase SQL Editor:

```sql
CREATE TABLE ai_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bot_type TEXT NOT NULL,
  prompt TEXT,
  response TEXT,
  user_role TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_ai_insights_bot_type ON ai_insights(bot_type);
CREATE INDEX idx_ai_insights_created_at ON ai_insights(created_at DESC);

-- RLS policies (optional)
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Policy to allow edge functions to insert
CREATE POLICY "Service role can insert insights" ON ai_insights
  FOR INSERT TO service_role
  USING (true);
```

## Monitoring & Analytics

### View Function Logs
```bash
supabase functions logs genie
supabase functions logs retailbot
supabase functions logs adsbot
```

### Check Function Status
Visit your Supabase Dashboard → Functions tab to see:
- Invocation count
- Error rate
- Average duration
- Recent logs

## Advantages of Edge Functions

1. **Ultra-low latency**: Functions run at the edge, close to users
2. **Zero-ops**: No servers to manage, auto-scaling included
3. **Built-in auth**: Integrate with Supabase Auth if needed
4. **Global CDN**: Deployed worldwide automatically
5. **Cost-effective**: Pay only for invocations

## Troubleshooting

### Function not responding
- Check logs: `supabase functions logs <function-name>`
- Verify secrets are set: `supabase secrets list`
- Test locally: `supabase functions serve <function-name>`

### CORS errors
- Ensure the `_shared/cors.ts` file is properly imported
- Add your domain to allowed origins if needed

### Rate limits
- Groq: Check your API key limits
- OpenAI: Monitor usage in OpenAI dashboard
- Supabase: Check function invocation limits

## Comparison: Edge Functions vs Render

| Feature | Supabase Edge Functions | Render Deployment |
|---------|------------------------|-------------------|
| Latency | Ultra-low (edge) | Low (regional) |
| Setup | Simple CLI commands | Docker + config |
| Scaling | Automatic | Manual/auto |
| Cost | Per invocation | Per instance hour |
| Maintenance | Zero-ops | Some ops required |
| Custom domains | Via Supabase | Native support |

## Next Steps

1. **Add Authentication**: Remove `--no-verify-jwt` and implement auth
2. **Custom Models**: Use different AI models per bot
3. **Caching**: Implement response caching for common queries
4. **Webhooks**: Add webhook endpoints for event-driven responses
5. **Monitoring**: Set up alerts for errors or high usage

---

🎉 Your AI bots are now running as Supabase Edge Functions with global distribution and zero maintenance!