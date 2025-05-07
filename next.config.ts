import withMDX from "@next/mdx";
import type { NextConfig } from "next";
import { BASE_PATH } from "./settings";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  pageExtensions: ["mdx", "ts", "tsx"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // https://github.com/vercel/next.js/discussions/48324
  cacheHandler: require.resolve(
    "next/dist/server/lib/incremental-cache/file-system-cache.js",
  ),
};

export default withMDX()(nextConfig);
