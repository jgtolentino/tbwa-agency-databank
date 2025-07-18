import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable Tailwind CSS v4 built-in support
    optimizePackageImports: [],
  },
};

export default nextConfig;
