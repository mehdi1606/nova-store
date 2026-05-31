import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the tracing root to this project so the stray lockfile in the
  // user's home directory doesn't get picked as the workspace root.
  outputFileTracingRoot: path.join(__dirname),
  // Allow an isolated build dir (set NEXT_DIST_DIR) so a production build
  // can run without clobbering a dev server already using .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
