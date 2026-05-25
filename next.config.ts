import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["dodopayments", "standardwebhooks", "@react-pdf/renderer"],
};

export default nextConfig;
