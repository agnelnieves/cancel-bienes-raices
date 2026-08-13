import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@cancel/ui", "@cancel/data"],
  reactCompiler: true,
}

export default nextConfig
