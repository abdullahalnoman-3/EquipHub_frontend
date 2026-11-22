import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "equiphubadmin.hmnoman.com",
      },
      {
        protocol: "http",
        hostname: "equiphubadmin.hmnoman.com",
      },
      {
        protocol: "https",
        hostname: "equiphub.hmnoman.com",
      },
      {
        protocol: "http",
        hostname: "equiphub.hmnoman.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;
