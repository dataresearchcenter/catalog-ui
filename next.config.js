const withMDX = require("@next/mdx")();

const basePath = process.env.BASE_PATH || "/library";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
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

module.exports = withMDX(nextConfig);
