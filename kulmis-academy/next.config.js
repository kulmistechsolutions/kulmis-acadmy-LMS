const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      tailwindcss: path.join(__dirname, "node_modules", "tailwindcss"),
    },
  },
  webpack: (config) => {
    config.context = __dirname;
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: path.join(__dirname, "node_modules", "tailwindcss"),
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
