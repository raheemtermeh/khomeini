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
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,woff,woff2,ttf,eot}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
      },
      manifest: {
        name: "Fun Zone",
        short_name: "FunZone",
        description: "اپلیکیشن مدیریت رویدادهای فان زون",
        theme_color: "#F01B29",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "./public/labtopIcon.jpeg",
            sizes: "192x192",
            type: "image/jpeg",
          },
          {
            src: "./public/mobileIcon.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
          },
          {
            src: "./public/labtopScreenShot.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
          {
            src: "./public/mobileScreenShot.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
        ],
      },
      // اضافه کردن این تنظیمات برای حل مشکل مسیر Service Worker
      strategies: "generateSW",
      srcDir: "src",
      filename: "sw.ts",
    }),
    
  ],
  base: "./",
  server: {
    allowedHosts: [
      'fz-front.linooxel.com',  // ✅ add your domain here
      'localhost',
      '127.0.0.1',
    ],
    // می‌توانید تنظیمات اضافی سرور هم اضافه کنید
    host: true, // listen on all addresses
    port: 5173, // پورت پیشفرض Vite
  }
});
