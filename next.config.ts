import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the root so builds resolve `@/*` against this directory even when the
  // checkout sits inside another workspace (e.g. a git worktree).
  turbopack: { root: path.resolve() },
  outputFileTracingRoot: path.resolve(),
};

export default nextConfig;
