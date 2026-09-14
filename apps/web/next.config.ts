import type { NextConfig } from 'next';

const API_URL = process.env.API_URL || 'http://localhost:4000';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The browser talks to the backend through the web origin, so auth cookies
  // are first-party and no CORS is needed.
  async rewrites() {
    return ['/api/auth/:path*', '/api/auth-config', '/api/me/:path*', '/api/titles/:path*'].map((source) => ({
      source,
      destination: `${API_URL}${source}`,
    }));
  },
};

export default nextConfig;
