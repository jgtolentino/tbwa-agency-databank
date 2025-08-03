This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Scout v5 Features

- **Gold-only data service** (views: `gold_recent_transactions`, `gold_kpi_overview`, `gold_brand_performance`; RPCs: `get_gold_recent_transactions`, `get_gold_recent_transactions_count`, `get_gold_brand_performance`, `get_gold_kpi_overview`, `get_master_filters`)
- **Master data** for filters/joins (`brands`, `categories`, `products`, `competitor_sets`, `geo_region`, `geo_place`, `stores`, `price_bands`, `time_dim`)
- **Faceted filters** with URL-synced **Global Filter Bar**
- **Pages**: home, live, brand, mix, behavior, profile, market, **geographic**, saved, insights, predict
- **Modules**: Saved Queries, AI Insight Templates, Predictive Metrics, ChartVision, LearnBot
- **Security**: RLS + role scopes; audit trail on RPCs
- **SLOs**: RPC p95 ≤ 250 ms, LCP p95 ≤ 2.5 s, error ≤ 0.5%
- **Observability**: PostHog, Sentry, function logs
- **Exports**: CSV tables, PNG charts
MD < /dev/null