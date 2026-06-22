import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: `next build` emits a fully static site to `out/`,
  // which is published to S3 and served via CloudFront. No Next.js server
  // runtime is used — the app is client-rendered and talks to the FastAPI
  // backend over the API Gateway endpoint.
  output: "export",
  // Emit each route as a directory with index.html (e.g. /dashboard/index.html),
  // which maps cleanly onto S3 keys and the CloudFront rewrite function.
  trailingSlash: true,
  // next/image's default loader needs the Next server; disable optimization
  // so <Image> works under static export.
  images: { unoptimized: true },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
