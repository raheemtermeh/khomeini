// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["fz-front.linooxel.com", "localhost", "127.0.0.1"],
  },
  resolve: {
    alias: {
      // دیگه نیاز به alias برای virtual module نیست
    },
  },
});
