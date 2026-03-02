import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Publisher domains (with subdomains for CDNs)
      { protocol: "https", hostname: "**.techcrunch.com" },
      { protocol: "https", hostname: "**.arstechnica.com" },
      { protocol: "https", hostname: "**.theverge.com" },
      { protocol: "https", hostname: "**.wired.com" },
      { protocol: "https", hostname: "**.technologyreview.com" },
      { protocol: "https", hostname: "**.venturebeat.com" },
      { protocol: "https", hostname: "**.cnbc.com" },
      // Common CDNs used by these publishers
      { protocol: "https", hostname: "cdn.vox-cdn.com" },
      { protocol: "https", hostname: "**.wp.com" },
      { protocol: "https", hostname: "**.wordpress.com" },
      { protocol: "https", hostname: "**.s.yimg.com" },
      { protocol: "https", hostname: "image.cnbcfm.com" },
      { protocol: "https", hostname: "media.wired.com" },
      { protocol: "https", hostname: "cdn.arstechnica.net" },
      { protocol: "https", hostname: "duet-cdn.vox-cdn.com" },
      { protocol: "https", hostname: "platform.theverge.com" },
      { protocol: "https", hostname: "wp.technologyreview.com" },
      { protocol: "https", hostname: "venturebeat.com" },
      // Cybersecurity publishers
      { protocol: "https", hostname: "**.bleepingcomputer.com" },
      { protocol: "https", hostname: "**.thehackernews.com" },
      { protocol: "https", hostname: "krebsonsecurity.com" },
      { protocol: "https", hostname: "**.krebsonsecurity.com" },
      { protocol: "https", hostname: "blogger.googleusercontent.com" },
    ],
  },
  serverExternalPackages: ["firebase-admin"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
