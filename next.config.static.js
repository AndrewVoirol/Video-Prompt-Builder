/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true, // Required for static export
  },
  // Enable static export
  output: 'export',
  // Disable server-side features for static export
  trailingSlash: true,
  // Turbopack is enabled by default in Next.js 15
  // No explicit configuration needed
}

module.exports = nextConfig
