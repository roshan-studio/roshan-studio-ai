import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 25 * 1024 * 1024
      },
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "ROSHAN STUDIO AI",
        short_name: "روشان",
        description: "استوديو روشان لتصميم الدعوات",
        theme_color: "#173b32",
        background_color: "#f5f3ed",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});