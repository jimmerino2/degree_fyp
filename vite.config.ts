/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // New versions install in the background and take over on the next launch.
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "icon.svg", "samples/*"],
      manifest: {
        name: "Rootline",
        short_name: "Rootline",
        description: "Chilli plant health checks that work offline.",
        lang: "en",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#2f6b3a",
        background_color: "#f6f7f4",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // App shell: everything Vite builds is precached, so the app opens with no signal.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // CNN bundle (documentation/CNN_SETUP.md §7) and onnxruntime-web WASM:
            // downloaded once, then served from cache. Bump the folder name to ship a new model.
            urlPattern: ({ url }) => url.pathname.startsWith("/models/") || url.pathname.endsWith(".wasm"),
            handler: "CacheFirst",
            options: {
              cacheName: "rootline-models",
              expiration: { maxEntries: 20 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    // Lets the app call the FastAPI backend as /api/* in dev, without CORS.
    proxy: { "/api": "http://localhost:8000" },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    css: false,
  },
});
