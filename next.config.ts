import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
  serverExternalPackages: ["@electric-sql/pglite"],
  partialPrefetching: true,
  // The clinic page became the partner page.
  redirects: async () => [{ source: "/rendeloknek", destination: "/partnereknek", permanent: true }],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
