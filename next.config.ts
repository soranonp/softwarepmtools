import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site for Cloudflare Pages — no backend, no SSR, no API routes.
  // `next build` emits an `out/` directory of HTML/CSS/JS assets.
  output: "export",

  // Static export cannot use the default on-demand Image Optimization loader.
  // The project has no next/image usage, but this keeps any future <Image>
  // working without a server.
  images: {
    unoptimized: true,
  },

  // Emit `route/index.html` (e.g. out/tools/index.html) so Cloudflare Pages
  // serves clean URLs without redirects.
  trailingSlash: true,
};

export default nextConfig;
