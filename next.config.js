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
};

module.exports = withMDX(nextConfig);
