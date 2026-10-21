import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["three", "@react-three/fiber", "@react-three/drei", "lucide-react"],
  },
};

export default nextConfig;
