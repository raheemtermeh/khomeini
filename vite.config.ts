// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      strategies: "generateSW", 
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf,eot}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        navigateFallbackDenylist: [/^\/api/], 
      },
      
      manifest: {
        name: "اپ رویداد فان زون",
        short_name: "FunZone",
        description: "اپلیکیشن مدیریت رویدادهای فان زون",
        theme_color: "#db2777",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        
        icons: [
          {
            src: "/labtopIcon.jpeg",
            sizes: "192x192",
            type: "image/jpeg",
          },
          {
            src: "/mobileIcon.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
          },
          {
            src: "/labtopScreenShot.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
          {
            src: "/mobileScreenShot.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
        ],

        screenshots: [
            {
              src: "/labtopScreenShot.jpeg",
              sizes: "1280x720",
              type: "image/jpeg",
              form_factor: "wide",
              label: "نمایش صفحه اصلی در دسکتاپ"
            },
            {
              src: "/mobileScreenShot.jpeg",
              sizes: "720x1280",
              type: "image/jpeg",
              form_factor: "narrow",
              label: "نمایش صفحه اصلی در موبایل"
            }
        ]
      },
    }),
  ],
  // ✨ بخش base و server باید به این شکل نهایی شوند ✨
  base: "./", 
  server: {
    allowedHosts: [
      'fz-front.linooxel.com',
      'localhost',
      '127.0.0.1',
    ],
    host: true, 
    port: 5173, 
  }
});