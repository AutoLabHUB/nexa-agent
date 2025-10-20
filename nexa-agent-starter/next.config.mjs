// next.config.mjs
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  webpack: (config) => {
    // Ensure "@/..." points to "src/..."
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(process.cwd(), "src"),
    };
    // Optional fallbacks
    config.resolve.fallback = { ...(config.resolve.fallback || {}), fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;

