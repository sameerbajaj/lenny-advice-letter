import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/tools/timecapsule",
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/generate": ["./data/**/*"],
  },
};

export default nextConfig;
