# Scout Dashboard 3.0

**Schema**: `scout_dash` | **Writer MCP Port**: 8890 | **Aliases**: `:scout`, `:sd`

## Overview

Multi-agent powered analytics platform with enterprise-grade governance and performance optimization for TBWA's retail insights.

## Architecture

- **Frontend**: Next.js 15.4.1 with TypeScript and Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **AI**: Groq LPU (primary), OpenAI (fallback)
- **Charts**: Recharts for visualizations

## AI Agents

### 🧞 Aladdin Insights
- **Executive AI genie** replacing traditional AI Genie
- Anomaly detection with z-score analysis
- What-if modeling capabilities
- Proactive scheduling for alerts

### 🛒 RetailBot
- **Conversational retail analytics**
- Intent parsing and SQL template mapping
- Context retention (3 questions)
- Chart generation with drill-down links

### 📈 AdsBot
- **Marketing analytics specialist**
- Campaign performance analysis
- Proactive alerts for anomalies
- ROI optimization recommendations

### 🔒 SQL-Certifier
- **Governance agent** for SQL generation
- Template-based SQL generation
- Parameter validation
- Audit logging for compliance

## Key Features

### Performance Optimization
- **Fixed grid system** that maintains box positions
- **Dynamic content swapping** within boxes using `CardWithSwitcher`
- **Optimized for 15,000+ records** with data pre-aggregation and memoization
- **Responsive design**: 4 columns → 2 → 1 on mobile

### Security & Governance
- **Row Level Security (RLS)** for multi-tenant data access
- **SQL template governance** with 8 pre-approved queries
- **Comprehensive audit logging** for all AI interactions
- **Role-based access control** (Executive, Regional Manager, Analyst, Store Owner)

### User Experience
- **Free-text query box** for natural language questions
- **Quick action buttons** and drill-down links
- **Role-based dashboards** with adaptive layouts
- **Export functionality** for PDF/Excel reports (planned)

## Quick Start

```bash
npm install
npm run dev

# Test AI bots
open http://localhost:3000/test-bots

# Optimized dashboard
open http://localhost:3000/dashboard/optimized
```

## Deployment

### Production Environment
- **Frontend**: Vercel
- **Edge Functions**: Supabase
- **Database**: PostgreSQL via Supabase

### Required Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://cxzllzyxwpyptfretryc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_GENIE_URL=https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/aladdin
NEXT_PUBLIC_RETAILBOT_URL=https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/retailbot
NEXT_PUBLIC_ADSBOT_URL=https://cxzllzyxwpyptfretryc.supabase.co/functions/v1/adsbot
```

### Edge Functions Deployment
```bash
supabase functions deploy aladdin --no-verify-jwt
supabase functions deploy retailbot --no-verify-jwt
supabase functions deploy adsbot --no-verify-jwt
supabase functions deploy sql-certifier --no-verify-jwt
```

## Project Structure

```
scout-dash/
├── app/
│   ├── dashboard/optimized/    # Optimized grid layout
│   └── test-bots/             # AI bot testing interface
├── components/
│   ├── cards/                 # KPI cards, switchers
│   ├── charts/                # All chart components
│   ├── grids/                 # Grid layouts per tab
│   └── filters/               # Filter components
├── supabase/functions/        # Edge Functions
│   ├── aladdin/              # Executive insights
│   ├── retailbot/            # Retail analytics
│   ├── adsbot/               # Ad analytics
│   └── sql-certifier/        # SQL governance
├── lib/
│   └── ai-bots.ts            # AI bot client library
├── agents.yaml               # Agent registry
├── sql_templates.json        # Approved SQL queries
└── .github/workflows/        # CI/CD pipelines
```

## Status

✅ **Production Ready**
- Complete multi-agent architecture implemented
- All 40+ React components created
- TypeScript errors resolved
- Performance optimized for 15,000+ records
- Ready for deployment on Vercel + Supabase