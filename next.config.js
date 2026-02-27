const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    // WSL2 filesystem race conditions corrupt webpack's pack file cache.
    // Memory cache eliminates all ENOENT rename / deserialization errors.
    if (dev) {
      config.cache = { type: "memory" };
    }

    // Paper.js ships with Node.js-specific files (dist/node/*) that pull in
    // jsdom, canvas, source-map-support, fs, etc. via static require() calls.
    // These are only needed for headless Node.js rendering with node-canvas
    // and jsdom, never for in-browser usage. Since our component dynamically
    // imports Paper.js only client-side (inside useEffect), we can safely
    // stub out the entire dist/node/ directory for both server and client
    // builds.
    const emptyModule = path.resolve(__dirname, "lib/empty-module.js");
    const paperDist = path.resolve(
      __dirname,
      "node_modules/paper/dist/node"
    );

    config.resolve.alias = {
      ...config.resolve.alias,
      // Map paper's node-only files to an empty stub
      [path.join(paperDist, "self.js")]: emptyModule,
      [path.join(paperDist, "extend.js")]: emptyModule,
      [path.join(paperDist, "canvas.js")]: emptyModule,
      [path.join(paperDist, "xml.js")]: emptyModule,
      // Also map the top-level node-only deps
      "jsdom/lib/jsdom/living/generated/utils": emptyModule,
      jsdom: emptyModule,
      canvas: emptyModule,
      "source-map-support": emptyModule,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
