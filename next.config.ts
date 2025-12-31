import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
    // domains: ['g8kdh41o51.ufs.sh'],
  },
};

export default nextConfig;
