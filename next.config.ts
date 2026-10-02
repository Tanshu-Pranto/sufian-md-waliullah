import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // /site.xml is the address some tools and old links use; serve the real sitemap there.
    return [{ source: "/site.xml", destination: "/sitemap.xml" }];
  },
};

export default nextConfig;
