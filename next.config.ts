import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["dodopayments", "standardwebhooks"],
};

export default nextConfig;
