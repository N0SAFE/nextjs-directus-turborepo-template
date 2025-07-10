import MillionLint from "@million/lint";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { NextConfig } from "next";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

console.log('Using API URL:', process.env.NEXT_PUBLIC_API_URL);

// Handle both full URLs and hostname-only values (for Render deployment)
let apiUrl: string;
try {
  // Try to parse as full URL first
  new URL(process.env.NEXT_PUBLIC_API_URL);
  apiUrl = process.env.NEXT_PUBLIC_API_URL;
} catch {
  // If it fails, assume it's a hostname and add https protocol
  apiUrl = `https://${process.env.NEXT_PUBLIC_API_URL}`;
}

const url = new URL(apiUrl);

const noCheck = process.env.CHECK_ON_BUILD !== "true";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: noCheck,
  },
  typescript: {
    ignoreBuildErrors: noCheck,
    // compilerOptions: {
    //   experimentalDecorators: true,
    //   useDefineForClassFields: true,
    // },
  },
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  experimental: {
    // ppr: 'incremental',
    reactCompiler: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: url.hostname,
        port: url.port,
        protocol: url.protocol.replace(":", ""),
      },
    ],
  },
  output: "standalone",
};

let exp = nextConfig as any;

if (process.env.ANALYZE === "true") {
  exp = withBundleAnalyzer()(exp);
}

if (
  process.env.NODE_ENV === "development" &&
  process.env.MILLION_LINT === "true"
) {
  const millionLintConfig = {
    rsc: true,
    dev: "debug",
  } as any;
  exp = MillionLint.next(millionLintConfig)(exp);
}

module.exports = exp;
