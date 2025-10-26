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
      // استفاده از استراتژی generateSW (پیش‌فرض) برای تولید سرویس ورکر
      strategies: "generateSW", 
      // تنظیمات Workbox برای کش کردن فایل‌ها
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf,eot}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        // اگر base: './' است، مطمئن شوید که مسیردهی در Workbox درست باشد
        navigateFallbackDenylist: [/^\/api/], 
      },
      
      // ✨ مانیفست (Manifest): تنظیمات PWA
      manifest: {
        // نام و توضیحات
        name: "اپ رویداد فان زون",
        short_name: "FunZone",
        description: "اپلیکیشن مدیریت رویدادهای فان زون", // ادغام توضیحات شما
        
        // رنگ‌ها و نمایش
        theme_color: "#db2777", // از رنگ پیشنهادی JSON استفاده شد
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        
        // آیکون‌ها (مسیردهی اصلاح شده: فایل‌های Public از ریشه در دسترس‌اند)
        icons: [
          {
            src: "/labtopIcon.jpeg", // مسیر اصلاح شده
            sizes: "192x192",
            type: "image/jpeg", // نوع فایل از jpeg استفاده شد
          },
          {
            src: "/mobileIcon.jpeg", // مسیر اصلاح شده
            sizes: "512x512",
            type: "image/jpeg",
          },
          {
            src: "/labtopScreenShot.jpeg", // مسیر اصلاح شده
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
          {
            src: "/mobileScreenShot.jpeg", // مسیر اصلاح شده
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
        ],

        // ✨ اسکرین‌شات‌ها (Screenshots): با استفاده از داده‌های JSON شما اضافه شد
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
<<<<<<< HEAD
  // تنظیم base برای استفاده از مسیرهای نسبی در محیط‌های غیر از ریشه دامنه
  base: "./", 
=======
  base: "./",
>>>>>>> 0248b6354e7d83647dbbae1804b82085eb93dfd4
  server: {
    allowedHosts: [
      'fz-front.linooxel.com',  // ✅ add your domain here
      'localhost',
      '127.0.0.1',
    ],
<<<<<<< HEAD
    // تنظیم host: true برای دسترسی از شبکه محلی
    host: true, 
    port: 5173, 
  }
});
=======
    // می‌توانید تنظیمات اضافی سرور هم اضافه کنید
    host: true, // listen on all addresses
    port: 5173, // پورت پیشفرض Vite
  }
});
>>>>>>> 0248b6354e7d83647dbbae1804b82085eb93dfd4
