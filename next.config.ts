import path from "path"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const nextConfig: NextConfig = {
  // Fix Turbopack root detection when multiple lockfiles exist in the monorepo.
  // Without this, Turbopack infers the wrong workspace root and resolves
  // next-intl/config alias relative to the wrong directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
