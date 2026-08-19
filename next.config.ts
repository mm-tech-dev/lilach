import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // NOTE: `output: 'standalone'` is deliberately NOT set here. Vision OS injects
  // it for the runtime image on its Linux builder; setting it locally breaks
  // `pnpm build` on Windows, where the tracing step cannot create symlinks.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.morevision.ai', pathname: '/**' },
      { protocol: 'https', hostname: 'morevision.co.il', pathname: '/**' },
    ],
  },
  async redirects() {
    // Preserve inbound links from the previous WordPress site (Hebrew slugs).
    return [
      { source: '/%D7%90%D7%95%D7%93%D7%95%D7%AA', destination: '/about', permanent: true },
      { source: '/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99-%D7%94%D7%9E%D7%A8%D7%9B%D7%96', destination: '/services', permanent: true },
      { source: '/%D7%A7%D7%95%D7%A8%D7%A1%D7%99%D7%9D', destination: '/courses', permanent: true },
      { source: '/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA', destination: '/services/workshops', permanent: true },
      { source: '/%D7%9E%D7%95%D7%A6%D7%A8%D7%99%D7%9D', destination: '/products', permanent: true },
      { source: '/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8', destination: '/contact', permanent: true },
      { source: '/%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA', destination: '/privacy', permanent: true },
      { source: '/%D7%94%D7%A6%D7%94%D7%A8%D7%AA-%D7%A0%D7%92%D7%99%D7%A9%D7%95%D7%AA', destination: '/accessibility', permanent: true },
      { source: '/accessibility-statement', destination: '/accessibility', permanent: true },
      { source: '/%D7%AA%D7%A7%D7%A0%D7%95%D7%9F-%D7%90%D7%AA%D7%A8', destination: '/terms', permanent: true },
      { source: '/home-new', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
