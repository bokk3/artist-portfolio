import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

// Only use PWA in production to avoid Turbopack compatibility issues
const config =
  process.env.NODE_ENV === "development"
    ? nextConfig
    : require("next-pwa")({
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === "development",
      })(nextConfig);

export default config;
