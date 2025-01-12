import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://linear-progression-backend.vercel.app",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
