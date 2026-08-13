import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@cancel/ui", "@cancel/data"],
  // The app is entirely client components (Zustand + localStorage, no server
  // data fetching) — the compiler auto-memoizes them so re-renders across the
  // dashboard, kanban, and comparador stay cheap without hand-rolled
  // useMemo/useCallback.
  reactCompiler: true,
}

export default nextConfig
