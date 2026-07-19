import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        // When the frontend asks for /api/chat...
        source: "/api/:path*",
        // ...secretly route it to your Express backend!
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
