import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ── Turbopack Workspace Root Override ─────────────────────────────
  turbopack: {
    root: path.resolve(__dirname),
  },

  // ── Production Output ────────────────────────────────────────────
  // 'standalone' creates a minimal self-contained build for Docker/cloud deployment
  output: "standalone",

  // ── Security Headers ─────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // ── Performance ──────────────────────────────────────────────────
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
