import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* AWS Standalone Output - highly recommended for containerized deployment */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  /* Strict Mode for production stability */
  reactStrictMode: true,
};

export default nextConfig;
