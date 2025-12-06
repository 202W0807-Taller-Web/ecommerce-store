import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        // Proxy general
        "/api": {
          target: env.VITE_CATALOG_API_URL || "http://localhost:8080",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    build: {
    rollupOptions: {
      external: ['cypress']
    }
  }
  };
});
