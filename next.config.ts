import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
   images: {
    domains: ["niligiri-tourism.s3.amazonaws.com"],
  },
};

export default nextConfig;
