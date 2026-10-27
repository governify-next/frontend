import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["*.trycloudflare.com"],
  experimental: {
    transitionIndicator: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/organizations",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
