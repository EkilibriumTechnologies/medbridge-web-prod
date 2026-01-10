/** @type {import('next').NextConfig} */
import { createRequire } from "module";

// Check if element-tagger is available
function isElementTaggerAvailable() {
  try {
    const require = createRequire(import.meta.url);
    require.resolve("@softgenai/element-tagger");
    return true;
  } catch {
    return false;
  }
}

// Build turbo rules only if tagger is available
function getTurboRules() {
  if (!isElementTaggerAvailable()) {
    console.log(
      "[Softgen] Element tagger not found, skipping loader configuration"
    );
    return {};
  }

  return {
    "*.tsx": ["@softgenai/element-tagger"],
    "*.jsx": ["@softgenai/element-tagger"],
  };
}

const nextConfig = {
  reactStrictMode: true,
  // Enable static export only when building for Capacitor
  ...(process.env.CAPACITOR_BUILD === "true" && {
    output: "export",
    basePath: "",
    assetPrefix: "",
    trailingSlash: false,
  }),
  experimental: {
    turbo: {
      rules: getTurboRules(),
    },
  },
  images: {
    // Unoptimized images required for static export (Capacitor)
    ...(process.env.CAPACITOR_BUILD === "true" && { unoptimized: true }),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  allowedDevOrigins: ["*.daytona.work", "*.softgen.dev"],
};

export default nextConfig;
