import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["*.trycloudflare.com"],
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
