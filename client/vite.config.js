import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd(), "");

  // Default API URL if not specified in .env
  const apiUrl = env.VITE_API_URL || "http://localhost:3000";

  console.log("Using API URL:", apiUrl);

  return {
    plugins: [
      react(),
      // Offline logging already works — the session lives on the device — but
      // the app still needed a network fetch to *load*. This precaches the
      // shell so opening it cold in a basement gym works.
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icon.svg"],
        manifest: {
          name: "Linear Progression",
          short_name: "LP",
          description: "Track your lifts and progress over time.",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#570df8",
          icons: [
            {
              src: "/icon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          // Any route falls back to the cached shell; the app is a SPA.
          navigateFallback: "/index.html",
          globPatterns: ["**/*.{js,css,html,svg,woff2}"],
          // API calls must never be served from a stale cache — the app has
          // its own localStorage layer for what needs to survive offline.
          navigateFallbackDenylist: [/^\/api/],
          runtimeCaching: [
            {
              // Google Fonts are the one external dependency worth caching.
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          rewrite: (path) => path.replace(/^\/api/, ""),
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      "process.env.VITE_API_URL": JSON.stringify(apiUrl),
    },
  };
});
