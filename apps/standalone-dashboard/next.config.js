/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRICT_DATASOURCE: process.env.NEXT_PUBLIC_STRICT_DATASOURCE,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig