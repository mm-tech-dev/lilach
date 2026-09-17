// Plain ESM rather than TypeScript on purpose: loading a .ts config requires
// the `typescript` package to be present, which makes the build fail on any
// deploy that installs production dependencies only.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Vision OS builds the runtime container from `.next/standalone`, so the
  // standalone output is required on its Linux builder. It is skipped on
  // Windows, where Next's file-tracing step cannot create the symlinks it needs
  // and `pnpm build` fails with EPERM. The deploy platform is always Linux, so
  // the artefact it needs is always produced.
  output: process.platform === 'win32' ? undefined : 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.morevision.ai', pathname: '/**' },
      { protocol: 'https', hostname: 'morevision.co.il', pathname: '/**' },
    ],
  },
  async redirects() {
    // Preserve inbound links from the previous WordPress site (Hebrew slugs),
    // plus the routes absorbed when the site was reduced to four pages.
    return [
      { source: '/courses', destination: '/services/courses', permanent: true },
      { source: '/products', destination: '/services/shop', permanent: true },
      { source: '/testimonials', destination: '/about#testimonials', permanent: true },
      { source: '/%D7%90%D7%95%D7%93%D7%95%D7%AA', destination: '/about', permanent: true },
      { source: '/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99-%D7%94%D7%9E%D7%A8%D7%9B%D7%96', destination: '/services', permanent: true },
      { source: '/%D7%A7%D7%95%D7%A8%D7%A1%D7%99%D7%9D', destination: '/services/courses', permanent: true },
      { source: '/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA', destination: '/services/workshops', permanent: true },
      { source: '/%D7%9E%D7%95%D7%A6%D7%A8%D7%99%D7%9D', destination: '/services/shop', permanent: true },
      { source: '/%D7%A7%D7%95%D7%A8%D7%A1-%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98%D7%99', destination: '/online-course', permanent: true },
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
