/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  // /checkout wrote to columns the live DB doesn't have; /menu is the live site's URL (linked from the Instagram bio)
  async redirects() {
    return [
      { source: '/checkout', destination: '/cart', permanent: true },
      { source: '/menu', destination: '/order', permanent: true },
    ];
  },
};

export default nextConfig;
