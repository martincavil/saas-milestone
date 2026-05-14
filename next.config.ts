import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for @resvg/resvg-js native bindings
  serverExternalPackages: ['@resvg/resvg-js'],
  experimental: {
    // Allow reading font files from the filesystem in edge-compatible routes
  },
}

export default nextConfig
