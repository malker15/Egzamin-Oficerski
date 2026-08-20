import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/questions.json": ["./public/stage1q615/**/*"],
  },
};

export default nextConfig;
