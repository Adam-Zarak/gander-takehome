/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports
  output: 'standalone',
  
  // Strict mode for better development
  reactStrictMode: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Configure image domains if needed
  images: {
    domains: [],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 