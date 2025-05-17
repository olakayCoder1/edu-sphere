// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // // We're using Next.js App Router
  // experimental: {
  //   appDir: true,
  // },
  
  // Environment variables accessible on the client
  // These will be replaced at build time
  env: {
    // Default to localhost for development
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  },
  
  // Configure images domains if needed
  images: {
    domains: ['localhost'],
  },
  
  // Optional: Configure headers for CORS when needed
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  },
  
  // Optional: Proxy API requests to avoid CORS issues during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig