import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    server: {
      proxy: {
        // Proxy para evitar problemas de CORS durante desarrollo
        '/api': {
          target: env.VITE_CATALOG_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        }
      }
    }
  }
})
