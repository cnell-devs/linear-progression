import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd(), "");

  // Default API URL if not specified in .env
  const apiUrl = env.VITE_API_URL || "http://localhost:3000";

  console.log("Using API URL:", apiUrl);

  return {
    plugins: [react()],
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
