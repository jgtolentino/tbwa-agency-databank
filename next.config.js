/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Disable Turbopack for production builds
    turbo: false
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig