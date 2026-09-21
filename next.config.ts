import type { NextConfig } from "next";

// Deployed to GitHub Pages as a static export. The workflow passes PAGES_BASE_PATH:
// "/<repo>" while the site lives at <user>.github.io/<repo>, empty once a custom domain is set.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
