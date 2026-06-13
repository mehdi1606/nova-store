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
    // Cache optimised images on Vercel's CDN for a year so repeat visits and
    // re-renders serve instantly instead of re-optimising on every request.
    minimumCacheTTL: 31536000,
    // Product photos uploaded from the dashboard live in Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
