/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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