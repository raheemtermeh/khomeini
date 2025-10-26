/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// Cache version
const CACHE_NAME = "fun-zone-v1";

// Assets to cache
const assetsToCache = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  // سایر assetsهای مهم
];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(assetsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});
