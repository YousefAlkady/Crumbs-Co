import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // You can add more domains here later if you use Supabase storage!
    ],
  },
};

export default nextConfig;